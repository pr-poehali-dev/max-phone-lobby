import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

interface AppItem {
  id: string;
  name: string;
  icon: string;
  color: string;
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
];

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [openedApp, setOpenedApp] = useState<AppItem | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleAppClick = (app: AppItem) => {
    setOpenedApp(app);
    setSwipeOffset(0);
    setIsClosing(false);
  };

  const handleCloseApp = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpenedApp(null);
      setSwipeOffset(0);
      setIsClosing(false);
    }, 300);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBBC04] via-[#34A853] via-[#4285F4] to-[#EA4335] flex flex-col relative overflow-hidden">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full p-6">
        <div className="flex items-center justify-between text-white mb-12 animate-fade-in">
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

        <div className="flex-1 grid grid-cols-3 gap-6 content-start mb-20">
          {apps.map((app, index) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app)}
              className="flex flex-col items-center gap-3 group animate-fade-in hover-scale"
              style={{ animationDelay: `${index * 50}ms` }}
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

      {openedApp && (
        <div 
          className={`absolute inset-0 flex flex-col ${isClosing ? 'animate-scale-out' : 'animate-scale-up'}`}
          style={{ 
            backgroundColor: openedApp.color,
            transform: `translateY(${swipeOffset}px) scale(${1 - swipeOffset / 1000})`,
            transition: swipeOffset === 0 ? 'transform 0.3s ease-out' : 'none',
            opacity: 1 - swipeOffset / 500
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
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
        </div>
      )}
    </div>
  );
};

export default Index;
