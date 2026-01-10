import { Game } from '@/types/game';

export const games: Game[] = [
  {
    id: '1',
    name: 'Catan',
    description: 'Класична стратегічна гра про колонізацію острова. Гравці збирають ресурси, будують поселення та торгують між собою.',
    rating: 4.5,
    minPlayers: 3,
    maxPlayers: 4,
    playTime: 60,
    category: 'Стратегія'
  },
  {
    id: '2',
    name: 'Ticket to Ride',
    description: 'Гра про будівництво залізниць по всьому світу. Збирайте карти вагонів та прокладайте маршрути між містами.',
    rating: 4.7,
    minPlayers: 2,
    maxPlayers: 5,
    playTime: 45,
    category: 'Сімейна'
  },
  {
    id: '3',
    name: 'Wingspan',
    description: 'Елегантна гра про птахів, де ви збираєте колекцію птахів, які живуть у вашому заповіднику.',
    rating: 4.8,
    minPlayers: 1,
    maxPlayers: 5,
    playTime: 70,
    category: 'Природа'
  },
  {
    id: '4',
    name: 'Gloomhaven',
    description: 'Епічна кооперативна гра у фентезійному світі з величезною кількістю сценаріїв та персонажів.',
    rating: 4.9,
    minPlayers: 1,
    maxPlayers: 4,
    playTime: 120,
    category: 'Кооперативна'
  },
  {
    id: '5',
    name: 'Azul',
    description: 'Абстрактна гра про створення красивої мозаїки з португальських плиток азулежу.',
    rating: 4.6,
    minPlayers: 2,
    maxPlayers: 4,
    playTime: 45,
    category: 'Абстрактна'
  },
  {
    id: '6',
    name: 'Pandemic',
    description: 'Кооперативна гра, де гравці працюють разом, щоб зупинити глобальну пандемію.',
    rating: 4.5,
    minPlayers: 2,
    maxPlayers: 4,
    playTime: 60,
    category: 'Кооперативна'
  }
];

