import { Testimonial } from '../types';
import { getImage } from './products';

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Mariana Lopes',
    city: 'São Paulo · SP',
    text: 'Fiz o álbum de aniversário de 30 anos e o resultado me arrepiou. As fotos parecem de um ensaio fotográfico profissional de estúdio de verdade, com luz perfeita e cenário impecável!',
    rating: 5,
    avatar: getImage('tst1'),
    productName: 'Álbum Aniversário — 50 Fotos Luxury'
  },
  {
    id: 't2',
    name: 'Rafael & Camila',
    city: 'Belo Horizonte · MG',
    text: 'Nosso ensaio de casal ficou simplesmente surreal. Postamos nas redes e todos os nossos amigos acharam que viajamos para Paris no fim de semana. Aprovadíssimo!',
    rating: 5,
    avatar: getImage('tst2'),
    productName: 'Álbum Casal — 25 Fotos'
  },
  {
    id: 't3',
    name: 'Juliana Prado',
    city: 'Curitiba · PR',
    text: 'Download super rápido no e-mail e a nitidez dos rostos é impressionante. Já é a terceira vez que compro para presentear familiares.',
    rating: 5,
    avatar: getImage('tst3'),
    productName: 'Álbum Turismo — 20 Fotos de Paris'
  },
  {
    id: 't4',
    name: 'Diego Martins',
    city: 'Recife · PE',
    text: 'Comecei pelo ensaio Black, que é o mais acessível, e terminei aproveitando a promoção de 3 produtos para levar a cesta completa com 30% de desconto. Vale cada centavo.',
    rating: 5,
    avatar: getImage('tst4'),
    productName: 'Álbum Aniversário — 20 Fotos Black'
  }
];
