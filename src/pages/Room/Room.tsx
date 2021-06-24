import { useEffect } from 'react';
import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import logoImg from '../../assets/images/logo.svg';
import { Button } from '../../components/Button/Button';
import { RoomCode } from '../../components/RoomCode/RoomCode';
import { useAuth } from '../../hooks/useAuth';
import { database } from '../../services/firebase';
import styles from './Room.module.scss';

type FirebaseQuestions = Record<
  string,
  {
    content: string;
    author: {
      name: string;
      avatar: string;
    };
    isHighlighted: boolean;
    isAnswered: boolean;
  }
>;

type Question = {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  isHighlighted: boolean;
  isAnswered: boolean;
};

type RoomParams = {
  id: string;
};

export function Room() {
  const { user, signInWithGoogle } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');

  const roomId = params.id;

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);
    roomRef.on('value', (room) => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
        };
      });
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    });
  }, [roomId]);

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (!newQuestion.trim()) return;

    if (!user) {
      throw new Error('You must be logged in');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setNewQuestion('');
  }

  return (
    <div id={styles['page-room']}>
      <header>
        <div className={styles['content']}>
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main className={styles['content']}>
        <div className={styles['room-title']}>
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar"
            onChange={(event) => setNewQuestion(event?.target?.value)}
            value={newQuestion}
          ></textarea>

          <div className={styles['form-footer']}>
            {user ? (
              <div className={styles['user-info']}>
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button onClick={signInWithGoogle}>faça seu login</button>
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>
        {JSON.stringify(questions)}
      </main>
    </div>
  );
}
