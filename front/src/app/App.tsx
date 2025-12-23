import { useState, useRef, useEffect } from "react";
import { QuestionnaireStep } from "./components/QuestionnaireStep";
import { MovieCard } from "./components/MovieCard";
import { MovieDetailModal } from "./components/MovieDetailModal";
import { AuthModal } from "./components/AuthModal";
import { LoginModal } from "./components/LoginModal";
import { SignUpModal } from "./components/SignUpModal";
import { ChevronRight, ChevronLeft, Sun, Moon, LogIn, LogOut, User, ListFilter, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getCurrentUser, signOut, onAuthStateChange } from "../lib/supabase";

interface Content {
  id: string;
  title: string;
  year: number;
  genre: string;
  rating: number;
  image: string;
  duration: string;
  country: string;
  genres: string[];
  description: string;
  views: number;
  director: string;
  actors: string[];
  type: "movie" | "series";
  watchUrl: string;
}

 

const genreOptions = [
  {
    id: "action",
    label: "Боевик",
    image: "https://ixbt.online/live/images/original/13/41/70/2021/01/30/a53de36d89.png",
  },
  {
    id: "drama",
    label: "Драма",
    image: "https://upload.wikimedia.org/wikipedia/ru/thumb/e/ec/%D0%94%D1%80%D0%B0%D0%BC%D0%B0_%28%D1%84%D0%B8%D0%BB%D1%8C%D0%BC%2C_2026%29.jpg/250px-%D0%94%D1%80%D0%B0%D0%BC%D0%B0_%28%D1%84%D0%B8%D0%BB%D1%8C%D0%BC%2C_2026%29.jpg",
  },
  {
    id: "comedy",
    label: "Комедия",
    image: "https://ixbt.online/live/images/original/20/28/05/2023/03/20/41cb0ae55e.jpg",
  },
  {
    id: "horror",
    label: "Ужасы",
    image: "https://afishka31.ru/img/actions/2022/32583.jpg",
  },
  {
    id: "scifi",
    label: "Фантастика",
    image: "https://www.film.ru/sites/default/files/styles/thumb_260x400/public/movies/posters/7465149-3780215.jpg",
  },
  {
    id: "fantasy",
    label: "Фэнтези",
    image: "https://s4.afisha.ru/mediastorage/62/d1/da2b0810e19c40e0ab76fa58d162.jpg",
  },
  {
    id: "romance",
    label: "Романтика",
    image: "https://www.kino-teatr.ru/movie/posters/big/5/5/170355.jpg",
  },
  {
    id: "thriller",
    label: "Триллер",
    image: "https://www.kino-teatr.ru/movie/posters/big/4/5/165054.jpg",
  },
];

const allContent: Content[] = [
  {
    id: "1",
    title: "Начало",
    year: 2010,
    genre: "Фантастика",
    rating: 8.8,
    image: "https://upload.wikimedia.org/wikipedia/ru/b/bc/Poster_Inception_film_2010.jpg",
    duration: "148 мин",
    country: "США",
    genres: ["scifi", "thriller", "action"],
    description: "Кобб - талантливый вор, лучший из лучших в опасном искусстве извлечения: он крадет ценные секреты из глубин подсознания во время сна, когда человеческий разум наиболее уязвим.",
    views: 15000000,
    director: "Кристофер Нолан",
    actors: ["Леонардо ДиКаприо", "Марион Котийяр", "Джозеф Гордон-Левитт"],
    type: "movie",
    watchUrl: "https://kinogo.limited/23767-nachalo.html",
  },
  {
    id: "2",
    title: "Темный рыцарь",
    year: 2008,
    genre: "Боевик",
    rating: 9.0,
    image: "https://upload.wikimedia.org/wikipedia/ru/8/83/Dark_knight_rises_poster.jpg",
    duration: "152 мин",
    country: "США",
    genres: ["action", "thriller", "drama"],
    description: "Бэтмен поднимает ставки в войне с криминалом. С помощью лейтенанта Джима Гордона и прокурора Харви Дента он намерен очистить улицы от преступности. Но в городе появляется Джокер...",
    views: 18000000,
    director: "Кристофер Нолан",
    actors: ["Кристиан Бэйл", "Хит Леджер", "Аарон Экхарт"],
    type: "movie",
    watchUrl: "https://kinogo.online/filmy/22442-temnyj-rycar.html",
  },
  {
    id: "3",
    title: "Побег из Шоушенка",
    year: 1994,
    genre: "Драма",
    rating: 9.3,
    image: "https://a113.ru/upload/resize_cache/iblock/a70/270_404_2/13987.jpg",
    duration: "142 мин",
    country: "США",
    genres: ["drama"],
    description: "Бухгалтер Энди Дюфрейн обвинён в убийстве собственной жены и её любовника. Попав в тюрьму под названием Шоушенк, он сталкивается с жестокостью и беззаконием, царящими по обе стороны решётки.",
    views: 12000000,
    director: "Фрэнк Дарабонт",
    actors: ["Тим Роббинс", "Морган Фриман", "Боб Гантон"],
    type: "movie",
    watchUrl: "https://kinogo.inc/films/152-pobeg-iz-shoushenka-hd-hdl9-v19.html",
  },
  {
    id: "4",
    title: "Гарри Поттер и философский камень",
    year: 2001,
    genre: "Фэнтези",
    rating: 7.6,
    image: "https://upload.wikimedia.org/wikipedia/ru/b/b4/Harry_Potter_and_the_Philosopher%27s_Stone_%E2%80%94_movie.jpg",
    duration: "152 мин",
    country: "Великобритания",
    genres: ["fantasy", "action"],
    description: "Жизнь десятилетнего Гарри Поттера нельзя назвать сладкой: родители умерли, а дядя и тётя считают его обузой. Но в одиннадцатый день рождения Гарри всё меняется.",
    views: 20000000,
    director: "Крис Коламбус",
    actors: ["Дэниел Рэдклифф", "Эмма Уотсон", "Руперт Гринт"],
    type: "movie",
    watchUrl: "https://kinogo.media/tags/2001/",
  },
  {
    id: "5",
    title: "Заклятие",
    year: 2013,
    genre: "Ужасы",
    rating: 7.5,
    image: "https://upload.wikimedia.org/wikipedia/ru/9/9b/%D0%9F%D0%BE%D1%81%D1%82%D0%B5%D1%80_%D1%84%D0%B8%D0%BB%D1%8C%D0%BC%D0%B0_%C2%AB%D0%97%D0%B0%D0%BA%D0%BB%D1%8F%D1%82%D0%B8%D0%B5%C2%BB.jpg",
    duration: "112 мин",
    country: "США",
    genres: ["horror", "thriller"],
    description: "Семейная пара паранормальных исследователей Эд и Лоррейн Уоррен берётся помочь семье, которую терроризирует тёмная сущность в их фермерском доме.",
    views: 8000000,
    director: "Джеймс Ван",
    actors: ["Вера Фармига", "Патрик Уилсон", "Лили Тэйлор"],
    type: "movie",
    watchUrl: "",
  },
  {
    id: "6",
    title: "Титаник",
    year: 1997,
    genre: "Романтика",
    rating: 7.9,
    image: "https://www.kinobusiness.com/upload/resize_cache/iblock/76a/360_560_1/76af3b31c4e9b2def314e7b18aefbafc.jpg",
    duration: "194 мин",
    country: "США",
    genres: ["romance", "drama"],
    description: "История любви Джека и Розы разворачивается на борту легендарного лайнера «Титаник», совершающего свой первый и последний рейс в 1912 году.",
    views: 25000000,
    director: "Джеймс Кэмерон",
    actors: ["Леонардо ДиКаприо", "Кейт Уинслет", "Билли Зейн"],
    type: "movie",
    watchUrl: "",
  },
  {
    id: "7",
    title: "Джентльмены",
    year: 2019,
    genre: "Комедия",
    rating: 7.8,
    image: "https://media.kg-portal.ru/movies/g/gentlemen/posters/gentlemen_9o.jpg",
    duration: "113 мин",
    country: "Великобритания",
    genres: ["comedy", "action"],
    description: "Один ушлый американец ещё со студенческих лет приторговывал наркотиками, а теперь придумал схему нелегального обогащения с использованием поместий обедневшей английской аристократии.",
    views: 9000000,
    director: "Гай Ричи",
    actors: ["Мэттью МакКонахи", "Чарли Ханнэм", "Хью Грант"],
    type: "movie",
    watchUrl: "",
  },
  {
    id: "8",
    title: "Остров проклятых",
    year: 2010,
    genre: "Триллер",
    rating: 8.2,
    image: "https://image.tmdb.org/t/p/original/1d5OayKwiupaGc0GTEemWWnhaFJ.jpg",
    duration: "138 мин",
    country: "США",
    genres: ["thriller", "drama"],
    description: "Два американских судебных пристава отправляются на один из островов в штате Массачусетс, чтобы расследовать исчезновение пациентки клиники для умалишенных преступников.",
    views: 11000000,
    director: "Мартин Скорсезе",
    actors: ["Леонардо ДиКаприо", "Марк Руффало", "Бен Кингсли"],
    type: "movie",
    watchUrl: "",
  },
  {
    id: "9",
    title: "Интерстеллар",
    year: 2014,
    genre: "Фантастика",
    rating: 8.6,
    image: "https://preview.redd.it/would-we-want-a-second-interstellar-movie-v0-tvzsjfyox41a1.jpg?width=640&crop=smart&auto=webp&s=6120f86f9b9b6424e8e1817ae0623033ca02a941",
    duration: "169 мин",
    country: "США",
    genres: ["scifi", "drama"],
    description: "Когда засуха приводит человечество к продовольственному кризису, коллектив исследователей и учёных отправляется сквозь червоточину в путешествие, чтобы превзойти прежние ограничения для космических путешествий человека.",
    views: 16000000,
    director: "Кристофер Нолан",
    actors: ["Мэттью МакКонахи", "Энн Хэтэуэй", "Джессика Честейн"],
    type: "movie",
    watchUrl: "https://kinogo.limited/17487-interstellar.html",
  },
  {
    id: "10",
    title: "Форрест Гамп",
    year: 1994,
    genre: "Драма",
    rating: 8.8,
    image: "https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/3560b757-9b95-45ec-af8c-623972370f9d/220x330",
    duration: "142 мин",
    country: "США",
    genres: ["drama", "romance"],
    description: "От лица главного героя Форреста Гампа, слабоумного безобидного человека с благородным и открытым сердцем, рассказывается история его необыкновенной жизни.",
    views: 14000000,
    director: "Роберт Земекис",
    actors: ["Том Хэнкс", "Робин Райт", "Гэри Синиз"],
    type: "movie",
    watchUrl: "https://kinogo.inc/films/3324-forrest-gamp-hd-hdl9.html",
  },
  {
    id: "11",
    title: "Матрица",
    year: 1999,
    genre: "Фантастика",
    rating: 8.7,
    image: "https://avatars.mds.yandex.net/get-kinopoisk-image/4774061/cf1970bc-3f08-4e0e-a095-2fb57c3aa7c6/220x330",
    duration: "136 мин",
    country: "США",
    genres: ["scifi", "action"],
    description: "Жизнь Томаса Андерсона разделена на две части: днём он - самый обычный офисный работник, получающий нагоняи от начальства, а ночью превращается в хакера по имени Нео.",
    views: 17000000,
    director: "Вачовски",
    actors: ["Киану Ривз", "Лоуренс Фишбёрн", "Кэрри-Энн Мосс"],
    type: "movie",
    watchUrl: "https://kinogo.online/filmy/13855-matrica.html",
  },
  {
    id: "12",
    title: "Зелёная миля",
    year: 1999,
    genre: "Драма",
    rating: 9.0,
    image: "https://ir.ozone.ru/s3/multimedia-3/c1000/6320867175.jpg",
    duration: "189 мин",
    country: "США",
    genres: ["drama", "fantasy"],
    description: "Пол Эджкомб — начальник блока смертников в тюрьме «Холодная гора», каждый из узников которого однажды проходит «зелёную милю» по пути к месту казни.",
    views: 13000000,
    director: "Фрэнк Дарабонт",
    actors: ["Том Хэнкс", "Майкл Кларк Дункан", "Дэвид Морс"],
    type: "movie",
    watchUrl: "https://kinogo.inc/films/353-zelenaya-milya-1999-hdtv-v8.html",
  },
  {
    id: "13",
    title: "Человек-паук: Возвращение домой",
    year: 2017,
    genre: "Боевик",
    rating: 7.3,
    image: "https://upload.wikimedia.org/wikipedia/ru/thumb/5/5a/Spider-Man_Homecoming_logo.jpg/250px-Spider-Man_Homecoming_logo.jpg",
    duration: "133 мин",
    country: "США",
    genres: ["action", "scifi", "thriller"],
    description: "Питер Паркер пытается найти баланс между своей обычной жизнью и обязанностями супергероя. Когда появляется новый враг - Стервятник, молодой герой должен доказать, что достоин носить костюм паука.",
    views: 21000000,
    director: "Джон Уоттс",
    actors: ["Том Холланд", "Зендея", "Майкл Китон"],
    type: "movie",
    watchUrl: "https://kinogo.inc/films/237-chelovek-pauk-vozvraschenie-domoy-2017-hd-mvisionstv13-v74-sw72.html",
  },
  {
    id: "14",
    title: "Один дома",
    year: 1990,
    genre: "Комедия",
    rating: 7.8,
    image: "https://tvbesedka.com/Upload/2019/11/20/21/11/30/dcac78f7-0498-4f74-9020-621b5f2e7f96.jpg",
    duration: "103 мин",
    country: "США",
    genres: ["comedy", "action"],
    description: "Восьмилетний Кевин Маккаллистер непреднамеренно остаётся один в большом доме, когда его семья улетает на рождественские каникулы. Мальчику придётся защищать дом от двух грабителей.",
    views: 19000000,
    director: "Крис Коламбус",
    actors: ["Мэкалей Калкин", "Джо Пеши", "Дэниэл Стерн"],
    type: "movie",
    watchUrl: "https://kinogo.online/filmy/17969-odin-doma.html",
  },
  {
    id: "15",
    title: "Один дома 2",
    year: 1992,
    genre: "Комедия",
    rating: 7.1,
    image: "https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/e87b5842-3065-422e-81e8-59a1ffcd9b6a/600x900",
    duration: "120 мин",
    country: "США",
    genres: ["comedy", "action"],
    description: "Кевин Маккаллистер снова остаётся один дома, но на этот раз в Нью-Йорке. Мальчик должен защитить себя от двух разбойников, которые решили разворовать банк.",
    views: 17000000,
    director: "Крис Коламбус",
    actors: ["Мэкалей Калкин", "Джо Пеши", "Дэниэл Стерн"],
    type: "movie",
    watchUrl: "https://hd.kinogo.fm/1059-odin-doma-2-zaterjannyj-v-nju-jorke.html",
  },
  {
    id: "16",
    title: "Мстители: Финал",
    year: 2019,
    genre: "Боевик",
    rating: 8.4,
    image: "https://preview.redd.it/oal0dnbot2m21.jpg?auto=webp&s=c752a1d0349172f89cf3e9149359c01b5979cbc5",
    duration: "181 мин",
    country: "США",
    genres: ["action", "scifi", "adventure"],
    description: "После событий, которые произошли в предыдущем фильме, оставшиеся мстители должны найти способ вернуть тех, кого унёс Танос, и остановить его раз и навсегда.",
    views: 30000000,
    director: "Энтони Руссо, Джо Руссо",
    actors: ["Роберт Дауни мл.", "Крис Евангс", "Марк Руффало"],
    type: "movie",
    watchUrl: "https://kinogo.online/filmy/425-mstiteli-final.html",
  },
  {
    id: "17",
    title: "Человек-паук: Нет пути домой",
    year: 2021,
    genre: "Боевик",
    rating: 7.4,
    image: "https://upload.wikimedia.org/wikipedia/ru/6/6e/Spider-Man_%E2%80%94_No_Way_Home_poster.jpg",
    duration: "150 мин",
    country: "США",
    genres: ["action", "scifi", "thriller"],
    description: "После того, как его личность раскрыта, Питер Паркер просит помощь у Доктора Стрэнджа. Что-то идёт не так, открывая двери в мультивселенную и принося опасности из других миров.",
    views: 25000000,
    director: "Джон Уоттс",
    actors: ["Том Холланд", "Зендея", "Бенедикт Камбербэтч"],
    type: "movie",
    watchUrl: "https://kinogo.online/filmy/47174-chelovek-pauk-net-puti-domoj.html",
  },
  {
    id: "18",
    title: "Призрак монахины",
    year: 2018,
    genre: "Ужасы",
    rating: 5.3,
    image: "https://kinogo.fm/uploads/posts/2022-04/1342929_1650735438.webp",
    duration: "96 мин",
    country: "США",
    genres: ["horror"],
    description: "Молодая монахиня совершает самоубийство в стенах монастыря. Два священника, один опытный экзорцист и молодой монах, направляются в монастырь, чтобы расследовать происходящее и противостоять тёмной силе.",
    views: 8000000,
    director: "Корин Харди",
    actors: ["Демиан Бичир", "Тайза Ладол", "Палатина Максимова"],
    type: "movie",
    watchUrl: "",
  },
  {
    id: "19",
    title: "Полтора шпиона",
    year: 2002,
    genre: "Комедия",
    rating: 6.7,
    image: "https://avatars.mds.yandex.net/get-kinopoisk-image/1898899/259bb0ea-9c80-4d26-be0e-5f1a50fb2d30/600x900",
    duration: "100 мин",
    country: "Франция, США",
    genres: ["comedy", "action"],
    description: "Простой лавочник по имени Дюпон случайно становится шпионом и вынужден работать с профессиональным агентом. Между ними завязывается комедийное партнёрство, полное ошибок и забавных ситуаций.",
    views: 10000000,
    director: "Артюр Шульмейстер",
    actors: ["Жан Рено", "Питер Селлерс", "Жан-Пьер Кастельнау"],
    type: "movie",
    watchUrl: "",
  },
  {
    id: "20",
    title: "Плохие парни",
    year: 1995,
    genre: "Боевик",
    rating: 7.0,
    image: "https://upload.wikimedia.org/wikipedia/ru/thumb/6/69/Bad_Boys_for_Life_%28poster%29.jpg/960px-Bad_Boys_for_Life_%28poster%29.jpg",
    duration: "119 мин",
    country: "США",
    genres: ["action", "comedy"],
    description: "Два напарника из полиции Майами - крутой и дерзкий копс и интеллигентный оперативник - должны работать вместе, чтобы поймать опасного наркобарона. Их разные стили ведут к комичным и взрывоопасным ситуациям.",
    views: 15000000,
    director: "Майкл Бэй",
    actors: ["Уилл Смит", "Мартин Лоуренс", "Йентл Пинкус"],
    type: "movie",
    watchUrl: "",
  },
  {
    id: "21",
    title: "Мстители: Война бесконечности",
    year: 2018,
    genre: "Фантастика",
    rating: 8.4,
    image: "https://kinogo.ec/uploads/posts/2020-03/1585484325-2092333441.jpg",
    duration: "149 мин",
    country: "США",
    genres: ["scifi", "action", "adventure"],
    description: "Могущественный титан Танос отправляется на поиск Камней Бесконечности, чтобы подчинить себе всю вселенную. Мстители должны объединить свои силы и защитить человечество от грозной угрозы.",
    views: 28000000,
    director: "Энтони Руссо, Джо Руссо",
    actors: ["Роберт Дауни мл.", "Крис Хемсворт", "Том Хиддлстон"],
    type: "movie",
    watchUrl: "https://kinogo.online/filmy/425-mstiteli-final.html",
  },
  {
    id: "22",
    title: "Ходячий замок",
    year: 2004,
    genre: "Фэнтези",
    rating: 8.0,
    image: "https://s4.afisha.ru/mediastorage/62/d1/da2b0810e19c40e0ab76fa58d162.jpg",
    duration: "119 мин",
    country: "Япония",
    genres: ["fantasy", "romance", "animation"],
    description: "Софи, простая девушка, попадает в замок волшебника Хауэла. Ей предстоит разобраться в сложных отношениях между её новыми друзьями и найти способ разрушить проклятие, которое всех связывает.",
    views: 18000000,
    director: "Хаяо Миядзаки",
    actors: ["Фиона Гласс", "Кристиан Бэйл", "Майкл Гамбон"],
    type: "movie",
    watchUrl: "",
  },
  {
    id: "23",
    title: "Фильм катастрофа: 13 минут",
    year: 2023,
    genre: "Триллер",
    rating: 6.5,
    image: "https://www.film.ru/sites/default/files/styles/thumb_260x400/public/movies/posters/1611122-2261005.jpeg",
    duration: "107 мин",
    country: "Швейцария",
    genres: ["thriller", "disaster"],
    description: "В швейцарском городе начинает разворачиваться масштабная катастрофа. У спасателей и чиновников есть всего 13 минут, чтобы эвакуировать людей и предотвратить трагедию. Напряженный триллер о борьбе со временем.",
    views: 9000000,
    director: "Фредерик Вульф",
    actors: ["Йэннс Триплеси", "Рене Риверс", "Йозеф Криселл"],
    type: "movie",
    watchUrl: "",
  },
  // Сериалы
  {
    id: "s1",
    title: "Игра престолов",
    year: 2011,
    genre: "Фэнтези",
    rating: 9.2,
    image: "https://upload.wikimedia.org/wikipedia/ru/4/49/Game_of_Thrones.jpg",
    duration: "8 сезонов",
    country: "США",
    genres: ["fantasy", "drama", "action"],
    description: "К концу подходит долгое лето, и Страна Семи Королевств вступает в пору смут и интриг. В это непростое время король решает искать поддержки у друга юности и призывает его стать правой рукой.",
    views: 35000000,
    director: "Дэвид Бениофф, Д.Б. Вайсс",
    actors: ["Эмилия Кларк", "Кит Харингтон", "Питер Динклэйдж"],
    type: "series",
    watchUrl: "",
  },
  {
    id: "s2",
    title: "Очень странные дела",
    year: 2016,
    genre: "Фантастика",
    rating: 8.7,
    image: "https://upload.wikimedia.org/wikipedia/ru/thumb/b/b1/Stranger_Things_season_1.jpg/960px-Stranger_Things_season_1.jpg",
    duration: "4 сезона",
    country: "США",
    genres: ["scifi", "horror", "thriller"],
    description: "История о загадочном исчезновении мальчика по имени Уилл в тихом провинциальном городке. С его пропажей в городе начинают происходить странные вещи.",
    views: 28000000,
    director: "Братья Даффер",
    actors: ["Милли Бобби Браун", "Финн Вулфард", "Вайнона Райдер"],
    type: "series",
    watchUrl: "",
  },
  {
    id: "s3",
    title: "Во все тяжкие",
    year: 2008,
    genre: "Драма",
    rating: 9.5,
    image: "https://images.iptv.rt.ru/images/c6tltebir4sslltr5qk0.jpg",
    duration: "5 сезонов",
    country: "США",
    genres: ["drama", "thriller"],
    description: "Школьный учитель химии Уолтер Уайт узнаёт, что болен раком лёгких. Учитывая сложное финансовое состояние дел семьи, а также перспективы, Уолтер решает заняться изготовлением метамфетамина.",
    views: 32000000,
    director: "Винс Гиллиган",
    actors: ["Брайан Крэнстон", "Аарон Пол", "Анна Ганн"],
    type: "series",
    watchUrl: "",
  },
  {
    id: "s4",
    title: "Шерлок",
    year: 2010,
    genre: "Триллер",
    rating: 9.1,
    image: "https://basket-17.wbbasket.ru/vol2755/part275583/275583576/images/c516x688/1.webp",
    duration: "4 сезона",
    country: "Великобритания",
    genres: ["thriller", "drama"],
    description: "Современная адаптация знаменитых детективных историй о Шерлоке Холмсе и докторе Ватсоне. Действие происходит в наши дни в Лондоне.",
    views: 24000000,
    director: "Марк Гэтисс, Стивен Моффат",
    actors: ["Бенедикт Камбербэтч", "Мартин Фриман", "Эндрю Скотт"],
    type: "series",
    watchUrl: "",
  },
  {
    id: "s5",
    title: "Друзья",
    year: 1994,
    genre: "Комедия",
    rating: 8.9,
    image: "https://kinogo.online/uploads/posts/2021-03/1615665963-1291105720.jpg",
    duration: "10 сезонов",
    country: "США",
    genres: ["comedy", "romance"],
    description: "Сериал рассказывает о весёлой жизни шестерых друзей, живущих в Нью-Йорке. Это истории о дружбе, любви, работе и обо всем том, что делает жизнь яркой и незабываемой.",
    views: 40000000,
    director: "Дэвид Крейн, Марта Кауфман",
    actors: ["Дженнифер Энистон", "Кортни Кокс", "Мэттью Перри"],
    type: "series",
    watchUrl: "",
  },
  {
    id: "s6",
    title: "Игра в кальмара",
    year: 2021,
    genre: "Драма",
    rating: 8.0,
    image: "https://okay.uz/uploads/media3/squidgames01_1632310495.jpeg",
    duration: "1 сезон",
    country: "Южная Корея",
    genres: ["drama", "thriller"],
    description: "Сотни играющих в долгах людей принимают приглашение соревноваться в детских играх за огромный денежный приз. Но участников ждут смертельные испытания.",
    views: 38000000,
    director: "Хван Дон-хёк",
    actors: ["Ли Чжун-джэ", "Пак Хэ-су", "Чо Сан-хо"],
    type: "series",
    watchUrl: "",
  },
  {
    id: "s7",
    title: "Игра в кальмара - Сезон 2",
    year: 2024,
    genre: "Драма",
    rating: 7.8,
    image: "https://upload.wikimedia.org/wikipedia/ru/5/56/%D0%98%D0%B3%D1%80%D0%B0_%D0%B2_%D0%BA%D0%B0%D0%BB%D1%8C%D0%BC%D0%B0%D1%80%D0%B0_%282-%D0%B9_%D1%81%D0%B5%D0%B7%D0%BE%D0%BD%2C_%D0%BF%D0%BE%D1%81%D1%82%D0%B5%D1%80%29.jpg",
    duration: "1 сезон",
    country: "Южная Корея",
    genres: ["drama", "thriller"],
    description: "Продолжение истории о смертельных играх. Гихун возвращается, чтобы разоблачить организаторов и положить конец их преступлениям раз и навсегда.",
    views: 32000000,
    director: "Хван Дон-хёк",
    actors: ["Ли Чжун-джэ", "Т.О.П", "Ли Бён-хо"],
    type: "series",
    watchUrl: "",
  },
  {
    id: "s8",
    title: "Зимородок",
    year: 2022,
    genre: "Драма",
    rating: 8.5,
    image: "https://avatars.mds.yandex.net/get-kinopoisk-image/6201401/a26a0a5e-384a-4e45-8752-7ded0280da46/576x",
    duration: "1 сезон",
    country: "Россия",
    genres: ["drama", "thriller"],
    description: "История о девушке, которая приезжает в небольшой город и оказывается втянута в опасные события. Её путь пересекается с судьбами других людей, скрывающих тёмные секреты.",
    views: 12000000,
    director: "Юлия Вишневская",
    actors: ["Виктория Полина", "Всеволод Воробьёв", "Артем Сафонов"],
    type: "series",
    watchUrl: "",
  },
  {
    id: "s9",
    title: "Чёрная любовь",
    year: 2019,
    genre: "Драма",
    rating: 8.3,
    image: "https://www.kino-teatr.ru/movie/posters/big/3/8/139383.jpg",
    duration: "1 сезон",
    country: "Турция",
    genres: ["drama", "romance", "thriller"],
    description: "Бахар - красивая девушка, которая попадается на глаза миллионеру Джемилю. Между ними разворачивается страстная история любви, полная интриг, тайн и опасности.",
    views: 24000000,
    director: "Джемиль Текин",
    actors: ["Бушра Сайилар", "Энгин Шеналь", "Берн Свенсон"],
    type: "series",
    watchUrl: "",
  },
];

const questions = [
  {
    id: "genres",
    question: "Какой жанр фильмов вам нравится?",
    multiSelect: true,
  },
];

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [contentType, setContentType] = useState<"all" | "movie" | "series">("movie");
  const [minRating, setMinRating] = useState<number>(0);
  const [showRatingFilter, setShowRatingFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Проверка пользователя при загрузке и слушание изменений аутентификации
  useEffect(() => {
    const checkUser = async () => {
      const { user } = await getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    };
    checkUser();

    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Закрытие поиска при клике вне него
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Фильтрация результатов поиска
  const searchResults = searchQuery.trim()
    ? allContent.filter((item) =>
        item.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      )
    : [];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleToggleGenre = (genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedGenres([]);
    setShowResults(false);
  };

  const handleLogin = (email: string, name: string) => {
    setUser({ email, name });
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const filteredContent = allContent
    .filter((item) => {
      // Фильтрация по типу контента
      if (contentType !== "all" && item.type !== contentType) {
        return false;
      }
      // Фильтрация по рейтингу
      if (item.rating < minRating) {
        return false;
      }
      // Фильтрация по жанрам (только если выбраны жанры)
      if (selectedGenres.length > 0 && showResults) {
        return item.genres.some((genre) => selectedGenres.includes(genre));
      }
      return true;
    })
    .sort((a, b) => b.rating - a.rating);

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-zinc-950" : "bg-gray-50"}`}>
      {/* Header */}
      <header className={`${theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"} border-b sticky top-0 z-40`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1
              onClick={handleReset}
              className={`cursor-pointer ${theme === "dark" ? "text-yellow-500" : "text-yellow-600"}`}
            >
              Cinemagic
            </h1>
            
            <nav className="hidden md:flex gap-6 items-center">
              <button
                onClick={() => {
                  setContentType("movie");
                  setShowResults(true);
                }}
                className={`${
                  contentType === "movie" && showResults
                    ? theme === "dark"
                      ? "text-yellow-500"
                      : "text-yellow-600"
                    : theme === "dark"
                    ? "text-white/70"
                    : "text-gray-600"
                } hover:${theme === "dark" ? "text-white" : "text-gray-900"} transition-colors`}
              >
                Фильмы
              </button>
              <button
                onClick={() => {
                  setContentType("series");
                  setShowResults(true);
                }}
                className={`${
                  contentType === "series" && showResults
                    ? theme === "dark"
                      ? "text-yellow-500"
                      : "text-yellow-600"
                    : theme === "dark"
                    ? "text-white/70"
                    : "text-gray-600"
                } hover:${theme === "dark" ? "text-white" : "text-gray-900"} transition-colors`}
              >
                Сериалы
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowRatingFilter(!showRatingFilter)}
                  className={`flex items-center gap-2 ${
                    theme === "dark" ? "text-white/70 hover:text-white" : "text-gray-600 hover:text-gray-900"
                  } transition-colors`}
                >
                  <ListFilter className="w-4 h-4" />
                  Рейтинг
                </button>
                {showRatingFilter && (
                  <div
                    className={`absolute top-full right-0 mt-2 ${
                      theme === "dark" ? "bg-zinc-800" : "bg-white"
                    } rounded-lg shadow-xl p-4 w-64 z-50`}
                  >
                    <label className={`block text-sm mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      Минимальный рейтинг: {minRating.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={minRating}
                      onChange={(e) => setMinRating(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
              <button
                onClick={handleReset}
                className={`${
                  theme === "dark" ? "text-white/70 hover:text-white" : "text-gray-600 hover:text-gray-900"
                } transition-colors`}
              >
                Выбор жанров
              </button>
            </nav>

            {/* Поиск */}
            <div ref={searchRef} className="hidden md:flex flex-1 max-w-md mx-6 relative">
              <div
                className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg ${
                  theme === "dark" ? "bg-zinc-800" : "bg-gray-100"
                }`}
              >
                <Search className={`w-5 h-5 ${theme === "dark" ? "text-white/50" : "text-gray-400"}`} />
                <input
                  type="text"
                  placeholder="Поиск фильмов..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(e.target.value.length > 0);
                  }}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  className={`flex-1 bg-transparent outline-none ${
                    theme === "dark" ? "text-white placeholder-white/50" : "text-gray-900 placeholder-gray-400"
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setShowSearchResults(false);
                    }}
                    className={`p-1 rounded ${theme === "dark" ? "hover:bg-zinc-700" : "hover:bg-gray-200"}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Выпадающий список результатов */}
              {showSearchResults && searchResults.length > 0 && (
                <div
                  className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-2xl overflow-hidden z-50 ${
                    theme === "dark" ? "bg-zinc-800" : "bg-white"
                  }`}
                >
                  <div className="max-h-96 overflow-y-auto">
                    {searchResults.slice(0, 6).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedContent(item);
                          setSearchQuery("");
                          setShowSearchResults(false);
                        }}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                          theme === "dark"
                            ? "hover:bg-zinc-700 border-b border-zinc-700 last:border-b-0"
                            : "hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                        }`}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-10 h-14 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium truncate ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {item.title}
                          </p>
                          <p
                            className={`text-sm ${
                              theme === "dark" ? "text-white/50" : "text-gray-500"
                            }`}
                          >
                            {item.year} • {item.genre}
                          </p>
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            theme === "dark" ? "text-yellow-500" : "text-yellow-600"
                          }`}
                        >
                          {item.rating}
                        </span>
                      </button>
                    ))}
                    {searchResults.length > 6 && (
                      <div
                        className={`px-4 py-2 text-center text-sm ${
                          theme === "dark" ? "text-white/50" : "text-gray-500"
                        }`}
                      >
                        И ещё {searchResults.length - 6} результатов...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {showSearchResults && searchQuery && searchResults.length === 0 && (
                <div
                  className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg p-4 text-center ${
                    theme === "dark" ? "bg-zinc-800" : "bg-white"
                  }`}
                >
                  <p className={theme === "dark" ? "text-white/50" : "text-gray-500"}>
                    Фильмы не найдены
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Мобильный поиск */}
              <button
                onClick={() => setShowMobileSearch(!showMobileSearch)}
                className={`md:hidden p-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-zinc-800 text-white/70 hover:text-white hover:bg-zinc-700"
                    : "bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                } transition-colors`}
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-zinc-800 text-yellow-500 hover:bg-zinc-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors`}
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full ${theme === "dark" ? "bg-yellow-500" : "bg-yellow-600"} flex items-center justify-center`}>
                      <User className="w-5 h-5 text-black" />
                    </div>
                    <span className={`hidden md:block ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {currentUser.displayName || currentUser.email}
                    </span>
                  </div>
                  <button
                    onClick={async () => {
                      await signOut();
                      setCurrentUser(null);
                    }}
                    className={`p-2 rounded-lg ${
                      theme === "dark"
                        ? "bg-zinc-800 text-white/70 hover:text-white hover:bg-zinc-700"
                        : "bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                    } transition-colors`}
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full ${theme === "dark" ? "bg-yellow-500" : "bg-yellow-600"} flex items-center justify-center`}>
                      <User className="w-5 h-5 text-black" />
                    </div>
                    <span className={`hidden md:block ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                      {user.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`p-2 rounded-lg ${
                      theme === "dark"
                        ? "bg-zinc-800 text-white/70 hover:text-white hover:bg-zinc-700"
                        : "bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                    } transition-colors`}
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-yellow-500 text-black hover:bg-yellow-600"
                      : "bg-yellow-600 text-white hover:bg-yellow-700"
                  } transition-colors`}
                >
                  <LogIn className="w-5 h-5" />
                  <span className="hidden md:inline">Войти</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Мобильный поиск */}
      {showMobileSearch && (
        <div
          className={`md:hidden ${
            theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
          } border-b sticky top-16 z-40 p-4`}
        >
          <div ref={searchRef} className="relative">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                theme === "dark" ? "bg-zinc-800" : "bg-gray-100"
              }`}
            >
              <Search className={`w-5 h-5 ${theme === "dark" ? "text-white/50" : "text-gray-400"}`} />
              <input
                type="text"
                placeholder="Поиск фильмов..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(e.target.value.length > 0);
                }}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                autoFocus
                className={`flex-1 bg-transparent outline-none ${
                  theme === "dark" ? "text-white placeholder-white/50" : "text-gray-900 placeholder-gray-400"
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchResults(false);
                  }}
                  className={`p-1 rounded ${theme === "dark" ? "hover:bg-zinc-700" : "hover:bg-gray-200"}`}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Выпадающий список результатов для мобильных */}
            {showSearchResults && searchResults.length > 0 && (
              <div
                className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-2xl overflow-hidden z-50 ${
                  theme === "dark" ? "bg-zinc-800" : "bg-white"
                }`}
              >
                <div className="max-h-96 overflow-y-auto">
                  {searchResults.slice(0, 6).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedContent(item);
                        setSearchQuery("");
                        setShowSearchResults(false);
                        setShowMobileSearch(false);
                      }}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                        theme === "dark"
                          ? "hover:bg-zinc-700 border-b border-zinc-700 last:border-b-0"
                          : "hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-14 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium truncate ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.title}
                        </p>
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-white/50" : "text-gray-500"
                          }`}
                        >
                          {item.year} • {item.genre}
                        </p>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-yellow-500" : "text-yellow-600"
                        }`}
                      >
                        {item.rating}
                      </span>
                    </button>
                  ))}
                  {searchResults.length > 6 && (
                    <div
                      className={`px-4 py-2 text-center text-sm ${
                        theme === "dark" ? "text-white/50" : "text-gray-500"
                      }`}
                    >
                      И ещё {searchResults.length - 6} результатов...
                    </div>
                  )}
                </div>
              </div>
            )}

            {showSearchResults && searchQuery && searchResults.length === 0 && (
              <div
                className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg p-4 text-center ${
                  theme === "dark" ? "bg-zinc-800" : "bg-white"
                }`}
              >
                <p className={theme === "dark" ? "text-white/50" : "text-gray-500"}>
                  Фильмы не найдены
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <div key="questionnaire" className="space-y-8">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`inline-block ${
                    theme === "dark" ? "bg-yellow-500 text-black" : "bg-yellow-600 text-white"
                  } px-4 py-2 rounded-full mb-4`}
                >
                  Шаг {currentStep + 1} из {questions.length}
                </motion.div>
              </div>

              <QuestionnaireStep
                question={questions[currentStep].question}
                options={genreOptions}
                selectedOptions={selectedGenres}
                onToggleOption={handleToggleGenre}
                multiSelect={questions[currentStep].multiSelect}
              />

              <div className="flex justify-center gap-4 mt-12">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className={`px-8 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                      theme === "dark"
                        ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Назад
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={selectedGenres.length === 0}
                  className={`px-8 py-3 rounded-lg transition-colors flex items-center gap-2 disabled:cursor-not-allowed ${
                    theme === "dark"
                      ? "bg-yellow-500 hover:bg-yellow-600 disabled:bg-zinc-800 text-black disabled:text-white/30"
                      : "bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-300 text-white disabled:text-gray-500"
                  }`}
                >
                  {currentStep < questions.length - 1 ? "Далее" : "Показать подборку"}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className={theme === "dark" ? "text-white" : "text-gray-900"}>
                    {contentType === "movie"
                      ? "Рекомендуем фильмы"
                      : contentType === "series"
                      ? "Рекомендуем сериалы"
                      : "Рекомендуем посмотреть"}
                  </h2>
                  <p className={theme === "dark" ? "text-white/60" : "text-gray-600"}>
                    Найдено {filteredContent.length}{" "}
                    {contentType === "movie"
                      ? "фильмов"
                      : contentType === "series"
                      ? "сериалов"
                      : "результатов"}
                    {minRating > 0 && ` с рейтингом от ${minRating.toFixed(1)}`}
                  </p>
                </div>
                <button
                  onClick={handleBack}
                  className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                    theme === "dark"
                      ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Изменить предпочтения
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredContent.map((item) => (
                  <MovieCard
                    key={item.id}
                    title={item.title}
                    year={item.year}
                    genre={item.genre}
                    rating={item.rating}
                    image={item.image}
                    duration={item.duration}
                    country={item.country}
                    onClick={() => setSelectedContent(item)}
                  />
                ))}
              </div>

              {filteredContent.length === 0 && (
                <div className="text-center py-20">
                  <p className={`mb-4 ${theme === "dark" ? "text-white/60" : "text-gray-600"}`}>
                    К сожалению, результатов с выбранными фильтрами не найдено
                  </p>
                  <button
                    onClick={() => {
                      setMinRating(0);
                      handleBack();
                    }}
                    className={`px-6 py-3 rounded-lg transition-colors ${
                      theme === "dark"
                        ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                        : "bg-yellow-600 hover:bg-yellow-700 text-white"
                    }`}
                  >
                    Сбросить фильтры
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className={`${theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"} border-t mt-20`}>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className={`mb-4 ${theme === "dark" ? "text-yellow-500" : "text-yellow-600"}`}>
                Cinemagic
              </h3>
              <p className={`text-sm ${theme === "dark" ? "text-white/60" : "text-gray-600"}`}>
                Ваш персональный помощник в мире кино
                
              </p>
              <p className={`text-sm ${theme === "dark" ? "text-white/60" : "text-gray-600"}`}>
                Разработчик: Салимов Юсуф
              </p>
            </div>
            <div>
              <h4 className={`mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                Разделы
              </h4>
              <ul className={`space-y-2 text-sm ${theme === "dark" ? "text-white/60" : "text-gray-600"}`}>
                <li>
                  <button
                    onClick={() => {
                      setContentType("movie");
                      setShowResults(true);
                    }}
                    className={`${
                      theme === "dark" ? "hover:text-white" : "hover:text-gray-900"
                    } transition-colors`}
                  >
                    Фильмы
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setContentType("series");
                      setShowResults(true);
                    }}
                    className={`${
                      theme === "dark" ? "hover:text-white" : "hover:text-gray-900"
                    } transition-colors`}
                  >
                    Сериалы
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowRatingFilter(!showRatingFilter)}
                    className={`${
                      theme === "dark" ? "hover:text-white" : "hover:text-gray-900"
                    } transition-colors`}
                  >
                    Рейтинги
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className={`mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                О проекте
              </h4>
              <ul className={`space-y-2 text-sm ${theme === "dark" ? "text-white/60" : "text-gray-600"}`}>
                <li>
                  <a
                    href="#"
                    className={`${
                      theme === "dark" ? "hover:text-white" : "hover:text-gray-900"
                    } transition-colors`}
                  >
                    О нас
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className={`${
                      theme === "dark" ? "hover:text-white" : "hover:text-gray-900"
                    } transition-colors`}
                  >
                    Контакты
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`mt-8 pt-8 border-t ${
              theme === "dark" ? "border-zinc-800 text-white/40" : "border-gray-200 text-gray-500"
            } text-center text-sm`}
          >
            © 2025 Cinemagic. Все права защищены.
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedContent && (
        <MovieDetailModal
          isOpen={!!selectedContent}
          onClose={() => setSelectedContent(null)}
          movie={selectedContent}
        />
      )}

      {showLoginModal && !showSignUpModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div onClick={(e) => e.stopPropagation()} className="max-w-lg w-full flex justify-center">
            <LoginModal
              onSuccess={(user: any) => {
                setShowLoginModal(false);
                setCurrentUser(user);
              }}
              onSignUp={() => {
                setShowLoginModal(false);
                setShowSignUpModal(true);
              }}
            />
          </div>
        </div>
      )}

      {showSignUpModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div onClick={(e) => e.stopPropagation()} className="max-w-lg w-full flex justify-center">
            <SignUpModal
              onSuccess={(user: any) => {
                setShowSignUpModal(false);
                setCurrentUser(user);
              }}
              onBack={() => {
                setShowSignUpModal(false);
                setShowLoginModal(true);
              }}
            />
          </div>
        </div>
      )}

      {currentUser && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg ${theme === "dark" ? "bg-green-900 text-white" : "bg-green-100 text-green-900"} z-40 hidden`}>
          <p>✓ Вы вошли как: {currentUser.email}</p>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
