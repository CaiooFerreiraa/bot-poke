import robot from 'robotjs';
import screenshot from 'screenshot-desktop';
import sharp from 'sharp';
import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs'

let imageUrl;
let text;

async function uploadImage(imagePath) {
  const apiKey = 'd23cb6bbdf88957';
  try {
    // Lê a imagem como um arquivo
    const formData = new FormData();
    formData.append('apikey', apiKey);
    formData.append('file', fs.createReadStream(imagePath));
    formData.append('filetype', "PNG")

    const response = await axios.post('https://api.ocr.space/parse/image', formData, {
      headers: formData.getHeaders(),
    });

    if (response.data.IsErroredOnProcessing) {
      console.error('Erro:', response.data.ErrorMessage);
    } else {
      text = response.data.ParsedResults[0].ParsedText;
    }
  } catch (error) {
    console.error('Erro ao processar a imagem:', error);
  }
}
// Chame a função com o caminho da imagem que você deseja processar

const captureAndCropScreen = async (cropRegion) => {
  try {
    // Captura a tela inteira (incluindo os dois monitores)
    const img = await screenshot({ format: 'png' });

    // Use o sharp para obter as dimensões da imagem capturada
    const image = sharp(img);
    const metadata = await image.metadata();

    const { width: imgWidth, height: imgHeight } = metadata;

    // Valida as coordenadas de corte para garantir que estão dentro dos limites da imagem capturada
    const { x, y, width, height } = cropRegion;

    if (x + width > imgWidth || y + height > imgHeight || x < 0 || y < 0) {
      throw new Error('A região de corte está fora dos limites da imagem capturada.');
    }

    // Usa a biblioteca sharp para cortar a região desejada
    await image
      .extract({ left: x, top: y, width, height })
      .toFile('cropped_image.png');
  } catch (err) {
    console.error('Erro ao cortar a imagem:', err.message);
  }
};

async function movePersonagem() {
  let direction = 'left'; // Inicia movendo para a direita
  const cropRegion = { x: 450, y: 130, width: 150, height: 40 };

  const move = async () => {
    robot.keyToggle(direction, 'down'); // Move na direção atual

    await captureAndCropScreen(cropRegion);

    imageUrl = './cropped_image.png';
    await uploadImage('./cropped_image.png');

    setTimeout(() => {
      robot.keyToggle(direction, 'up'); // Para o movimento
    }, 100);
    
    // Alterna a direção
    direction = direction === 'left' ? 'right' : 'left';

    if (text.includes('Weezing')) {
      console.log('Pokemon encontrado')
    }
  };

  const interval = setInterval(move, 1 * 500); // Move a cada 200ms

  // Movimentação aleatória a cada 10 segundos
  setInterval(() => {
    // Para o movimento atual
    robot.keyToggle(direction, 'up');

    // Movimento aleatório para a esquerda
    robot.keyToggle('left', 'down');
    setTimeout(() => {
      robot.keyToggle('left', 'up');
    }, 200);

    // Reinicia o movimento para alternar entre direita e esquerda
    direction = 'right'; // Reinicia para a direita
  }, 10000);

  // Para o movimento após um certo tempo (opcional)
  // setTimeout(() => {
  //   clearInterval(interval);
  // }, 60000); // Ajuste o tempo conforme necessário
}

movePersonagem();
