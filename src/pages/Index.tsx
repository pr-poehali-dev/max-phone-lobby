import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

interface AppItem {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Notification {
  id: number;
  app: string;
  title: string;
  message: string;
  time: string;
  icon: string;
  color: string;
}

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
}

interface Message {
  id: number;
  text: string;
  time: string;
  isMine: boolean;
}

const apps: AppItem[] = [
  { id: 'camera', name: 'Камера', icon: 'Camera', color: '#5F6368' },
  { id: 'messages', name: 'Сообщения', icon: 'MessageSquare', color: '#4285F4' },
  { id: 'phone', name: 'Телефон', icon: 'Phone', color: '#34A853' },
  { id: 'settings', name: 'Настройки', icon: 'Settings', color: '#5F6368' },
  { id: 'browser', name: 'Браузер', icon: 'Globe', color: '#FBBC04' },
  { id: 'mail', name: 'Почта', icon: 'Mail', color: '#EA4335' },
  { id: 'calendar', name: 'Календарь', icon: 'Calendar', color: '#4285F4' },
  { id: 'maps', name: 'Карты', icon: 'MapPin', color: '#34A853' },
  { id: 'music', name: 'Музыка', icon: 'Music', color: '#EA4335' },
  { id: 'play', name: 'Play Маркет', icon: 'Play', color: '#01875f' },
  { id: 'max', name: 'MAX', icon: 'Send', color: '#7C3AED' },
];

const notifications: Notification[] = [
  { id: 1, app: 'Сообщения', title: 'Новое сообщение', message: 'Привет! Как дела?', time: '5 мин назад', icon: 'MessageSquare', color: '#4285F4' },
  { id: 2, app: 'Почта', title: 'Gmail', message: 'У вас 3 новых письма', time: '20 мин назад', icon: 'Mail', color: '#EA4335' },
  { id: 3, app: 'Календарь', title: 'Напоминание', message: 'Встреча через 1 час', time: '1 ч назад', icon: 'Calendar', color: '#4285F4' },
];

const chats: Chat[] = [
  { id: 1, name: 'Анна Петрова', lastMessage: 'Отлично, увидимся завтра!', time: '14:23', unread: 2, avatar: '👩', online: true },
  { id: 2, name: 'Команда MAX', lastMessage: 'Новые функции уже доступны', time: '13:45', unread: 0, avatar: '🚀', online: true },
  { id: 3, name: 'Алексей Иванов', lastMessage: 'Документы отправил', time: '12:30', unread: 0, avatar: '👨', online: false },
  { id: 4, name: 'Мария Сидорова', lastMessage: 'Спасибо за помощь!', time: 'Вчера', unread: 1, avatar: '👩‍💼', online: false },
  { id: 5, name: 'Проект 2024', lastMessage: 'Встреча перенесена на 15:00', time: 'Вчера', unread: 0, avatar: '📊', online: true },
];

const chatMessages: Message[] = [
  { id: 1, text: 'Привет! Как проходит работа над проектом?', time: '14:15', isMine: false },
  { id: 2, text: 'Привет! Всё отлично, почти закончил дизайн', time: '14:18', isMine: true },
  { id: 3, text: 'Супер! А когда сможешь показать?', time: '14:20', isMine: false },
  { id: 4, text: 'Думаю завтра утром уже будет готово', time: '14:21', isMine: true },
  { id: 5, text: 'Отлично, увидимся завтра!', time: '14:23', isMine: false },
];

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [openedApp, setOpenedApp] = useState<AppItem | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [notificationOffset, setNotificationOffset] = useState(-100);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageText, setMessageText] = useState('');
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric',
      month: 'short'
    });
  };

  const getDayOfWeek = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { weekday: 'short' });
  };

  const handleAppClick = (app: AppItem) => {
    setOpenedApp(app);
    setSwipeOffset(0);
    setIsClosing(false);
    setSelectedChat(null);
  };

  const handleCloseApp = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpenedApp(null);
      setSwipeOffset(0);
      setIsClosing(false);
      setSelectedChat(null);
    }, 300);
  };

  const handleChatClick = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleBackToChats = () => {
    setSelectedChat(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaY = e.touches[0].clientY - touchStartY.current;
    const deltaX = Math.abs(e.touches[0].clientX - touchStartX.current);
    
    if (deltaY > 0 && deltaX < 50) {
      setSwipeOffset(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset > 150) {
      handleCloseApp();
    } else {
      setSwipeOffset(0);
    }
  };

  const handleNotificationTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleNotificationTouchMove = (e: React.TouchEvent) => {
    const deltaY = e.touches[0].clientY - touchStartY.current;
    const deltaX = Math.abs(e.touches[0].clientX - touchStartX.current);
    
    if (touchStartY.current < 100 && deltaX < 50) {
      const progress = Math.max(0, Math.min(100, (deltaY / window.innerHeight) * 100));
      setNotificationOffset(progress - 100);
      if (progress > 10) {
        setShowNotifications(true);
      }
    }
  };

  const handleNotificationTouchEnd = () => {
    if (notificationOffset > -50) {
      setNotificationOffset(0);
      setShowNotifications(true);
    } else {
      setNotificationOffset(-100);
      setShowNotifications(false);
    }
  };

  const closeNotifications = () => {
    setNotificationOffset(-100);
    setTimeout(() => setShowNotifications(false), 300);
  };

  const renderAppContent = () => {
    if (!openedApp) return null;

    if (openedApp.id === 'max') {
      if (selectedChat) {
        return (
          <div className="max-w-md mx-auto w-full flex flex-col h-full bg-gray-50">
            <div className="bg-[#7C3AED] p-4 text-white animate-slide-down">
              <div className="flex items-center gap-3">
                <button onClick={handleBackToChats} className="hover-scale">
                  <Icon name="ArrowLeft" size={24} />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-300 to-purple-500 flex items-center justify-center text-xl">
                    {selectedChat.avatar}
                  </div>
                  {selectedChat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#7C3AED] rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold">{selectedChat.name}</h2>
                  <p className="text-xs text-purple-200">{selectedChat.online ? 'в сети' : 'был(а) недавно'}</p>
                </div>
                <button className="hover-scale">
                  <Icon name="Phone" size={20} />
                </button>
                <button className="hover-scale">
                  <Icon name="MoreVertical" size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, index) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`max-w-[75%] ${msg.isMine ? 'bg-[#7C3AED] text-white' : 'bg-white text-gray-900'} rounded-2xl px-4 py-2 shadow-sm`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.isMine ? 'text-purple-200' : 'text-gray-500'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover-scale">
                  <Icon name="Plus" size={20} className="text-gray-600" />
                </button>
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Сообщение..."
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center hover-scale">
                  <Icon name="Send" size={18} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="max-w-md mx-auto w-full flex flex-col h-full bg-white">
          <div className="bg-[#7C3AED] p-4 text-white animate-slide-down">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button onClick={handleCloseApp} className="hover-scale">
                  <Icon name="ArrowLeft" size={24} />
                </button>
                <h1 className="text-xl font-bold">MAX</h1>
              </div>
              <div className="flex items-center gap-3">
                <button className="hover-scale">
                  <Icon name="Search" size={20} />
                </button>
                <button className="hover-scale">
                  <Icon name="MoreVertical" size={20} />
                </button>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium whitespace-nowrap hover-scale">
                Все чаты
              </button>
              <button className="px-4 py-2 bg-white/10 rounded-full text-sm font-medium whitespace-nowrap hover-scale">
                Непрочитанные
              </button>
              <button className="px-4 py-2 bg-white/10 rounded-full text-sm font-medium whitespace-nowrap hover-scale">
                Группы
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chats.map((chat, index) => (
              <button
                key={chat.id}
                onClick={() => handleChatClick(chat)}
                className="w-full flex items-center gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-2xl">
                    {chat.avatar}
                  </div>
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-6 h-6 bg-[#7C3AED] rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{chat.unread}</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="p-4 bg-white border-t border-gray-100">
            <button className="w-full py-3 bg-[#7C3AED] text-white rounded-2xl font-medium hover-scale flex items-center justify-center gap-2">
              <Icon name="Plus" size={20} />
              Новый чат
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-md mx-auto w-full flex flex-col h-full">
        <div className="flex items-center justify-between p-6 text-white animate-slide-down">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{formatTime(currentTime)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Icon name="Signal" size={16} className="opacity-90" />
            <Icon name="Wifi" size={16} className="opacity-90" />
            <div className="flex items-center gap-1">
              <Icon name="Battery" size={16} className="opacity-90" />
              <span className="text-xs font-medium">85%</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-white">
          <div className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 animate-scale-up" style={{ animationDelay: '100ms' }}>
            <Icon name={openedApp.icon} size={64} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
            {openedApp.name}
          </h1>
          <p className="text-white/80 text-center mb-2 animate-fade-in" style={{ animationDelay: '300ms' }}>
            Приложение запущено
          </p>
          <p className="text-white/60 text-sm text-center animate-fade-in" style={{ animationDelay: '400ms' }}>
            💡 Свайпните вниз, чтобы закрыть
          </p>
        </div>

        <div className="p-6">
          <button 
            onClick={handleCloseApp}
            className="w-full py-4 bg-white/20 backdrop-blur-md rounded-2xl text-white font-medium hover-scale"
          >
            Закрыть приложение
          </button>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-[#FBBC04] via-[#34A853] via-[#4285F4] to-[#EA4335] flex flex-col relative overflow-hidden"
      onTouchStart={handleNotificationTouchStart}
      onTouchMove={handleNotificationTouchMove}
      onTouchEnd={handleNotificationTouchEnd}
    >
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full p-6">
        <div className="flex items-center justify-between text-white mb-8 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{formatTime(currentTime)}</span>
          </div>
          <div className="flex items-center gap-3">
            <Icon name="Signal" size={16} className="opacity-90" />
            <Icon name="Wifi" size={16} className="opacity-90" />
            <div className="flex items-center gap-1">
              <Icon name="Battery" size={16} className="opacity-90" />
              <span className="text-xs font-medium">85%</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-white/25 backdrop-blur-md rounded-3xl p-6 shadow-xl animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white text-2xl font-medium">Москва</h3>
                <p className="text-white/80 text-sm">{getDayOfWeek(currentTime)}, {formatDate(currentTime)}</p>
              </div>
              <Icon name="CloudSun" size={48} className="text-white" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-white text-5xl font-light">22°</span>
              <span className="text-white/80 text-lg">/ 18°</span>
            </div>
          </div>

          <div className="bg-white/25 backdrop-blur-md rounded-3xl p-5 shadow-xl animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-medium flex items-center gap-2">
                <Icon name="Calendar" size={20} />
                Предстоящее событие
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="bg-[#4285F4] rounded-xl p-2 flex-shrink-0">
                  <div className="text-white text-center">
                    <div className="text-xs font-medium">ОКТ</div>
                    <div className="text-lg font-bold">{currentTime.getDate()}</div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Встреча с командой</p>
                  <p className="text-white/70 text-sm">15:00 - 16:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-6 content-start mb-20">
          {apps.map((app, index) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app)}
              className="flex flex-col items-center gap-3 group animate-fade-in hover-scale"
              style={{ animationDelay: `${(index + 3) * 50}ms` }}
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl group-active:scale-95"
                style={{ backgroundColor: app.color }}
              >
                <Icon name={app.icon} size={32} className="text-white" />
              </div>
              <span className="text-white text-sm font-medium drop-shadow-md">
                {app.name}
              </span>
            </button>
          ))}
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-full h-16 flex items-center justify-around px-8 shadow-lg">
          <button className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center hover-scale">
            <Icon name="Grid3x3" size={24} className="text-white" />
          </button>
          <button 
            onClick={handleCloseApp}
            className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center hover-scale"
          >
            <Icon name="Home" size={24} className="text-white" />
          </button>
          <button className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center hover-scale">
            <Icon name="Clock" size={24} className="text-white" />
          </button>
        </div>
      </div>

      {showNotifications && (
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/95 to-black/90 backdrop-blur-xl transition-transform duration-300 ease-out z-50"
          style={{ transform: `translateY(${notificationOffset}%)` }}
        >
          <div className="max-w-md mx-auto w-full h-full flex flex-col p-6">
            <div className="flex items-center justify-between text-white mb-8">
              <div>
                <h2 className="text-2xl font-bold">Уведомления</h2>
                <p className="text-white/70 text-sm">{formatTime(currentTime)}</p>
              </div>
              <button onClick={closeNotifications} className="hover-scale">
                <Icon name="X" size={24} className="text-white/80" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {notifications.map((notif, index) => (
                <div 
                  key={notif.id}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-4 animate-fade-in hover-scale"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: notif.color }}
                    >
                      <Icon name={notif.icon} size={24} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-white/60 text-xs font-medium">{notif.app}</p>
                        <p className="text-white/40 text-xs">{notif.time}</p>
                      </div>
                      <p className="text-white font-medium mb-1">{notif.title}</p>
                      <p className="text-white/70 text-sm">{notif.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button 
                onClick={closeNotifications}
                className="w-full py-4 bg-white/10 backdrop-blur-md rounded-2xl text-white font-medium hover-scale"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {openedApp && (
        <div 
          className={`absolute inset-0 flex flex-col ${isClosing ? 'animate-scale-out' : 'animate-scale-up'}`}
          style={{ 
            backgroundColor: openedApp.id === 'max' ? '#FFFFFF' : openedApp.color,
            transform: `translateY(${swipeOffset}px) scale(${1 - swipeOffset / 1000})`,
            transition: swipeOffset === 0 ? 'transform 0.3s ease-out' : 'none',
            opacity: 1 - swipeOffset / 500
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {renderAppContent()}
        </div>
      )}
    </div>
  );
};

export default Index;
