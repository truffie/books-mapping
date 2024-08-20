import './styles.css';
import {
  Book,
  BookInformation,
  Review,
  ReviewInformation,
  User,
} from './lib/types';
import { getBooks, getUsers, getReviews } from './lib/api';
import { useEffect, useState, FC } from 'react';
import Card from './Card';

// Техническое задание:
// Доработать приложение App, чтобы в отрисованном списке
// были реальные отзывы, автор книги и автор отзыва.
// Данные об отзывах и пользователях можно получить при помощи асинхронных
// функций getUsers, getReviews

// функция getBooks возвращает Promise<Book[]>
// функция getUsers возвращает Promise<User[]>
// функция getReviews возвращает Promise<Review[]>

// В объектах реализующих интерфейс Book указаны только uuid
// пользователей и обзоров

// В объектах реализующих интерфейс BookInformation, ReviewInformation
// указана полная информация об пользователе и обзоре.

const toBookInformation = (
  rawBookInfo: Book,
  author?: User,
  reviews?: ReviewInformation[]
): BookInformation => {
  return {
    id: rawBookInfo.id,
    name: rawBookInfo.name || 'Книга без названия',
    author: author
      ? author
      : { name: 'Неизвестный автор', id: rawBookInfo.authorId },
    reviews: reviews ?? [],
    description: rawBookInfo.description,
  };
};

const App: FC = () => {
  //TODO добавить обработку ошибок
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      const fetchedBooks = await getBooks();
      setBooks(fetchedBooks);

      setIsLoading(false);
    };

    const fetchUsers = async () => {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    };
    const fetchReviews = async () => {
      const fetchedReviews = await getReviews();
      setReviews(fetchedReviews);
    };

    fetchBooks();
    fetchUsers();
    fetchReviews();
  }, []);

  const buildReview = (id: string): ReviewInformation => {
    const reviewer = reviews.find(review => id === review.id);
    const user = users.find(user => user.id === reviewer?.userId);

    return {
      id: reviewer?.id || '',
      text: reviewer?.text || '',
      user: user ?? { id: '', name: '' },
    };
  };

  const buildBookCard = (rawBookInfo: Book): BookInformation => {
    const author: User | undefined = users.find(
      user => user.id === rawBookInfo.authorId
    );

    const reviewsInfo: ReviewInformation[] = rawBookInfo.reviewIds.map(id =>
      buildReview(id)
    );

    return toBookInformation(rawBookInfo, author, reviewsInfo);
  };

  return (
    <div>
      <h1>Мои книги:</h1>
      {isLoading && <div>Загрузка...</div>}
      {!isLoading &&
        //@ts-ignore
        books.map(b => <Card key={b.id} book={buildBookCard(b)} />)}
    </div>
  );
};

export default App;
