
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Camera, ThumbsUp } from 'lucide-react';

interface CompletionScreenProps {
  onRestart: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ onRestart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center space-y-8">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-scale-in">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-800">
                Запись окончена
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Благодарим вас за участие в видеоинтервью
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <ThumbsUp className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-700">Интервью успешно завершено!</span>
              </div>
              <p className="text-green-600 text-sm">
                Ваши ответы записаны и будут рассмотрены нашими специалистами
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">✓</span>
                </div>
                <p className="text-sm text-gray-600">Вопрос 1</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">✓</span>
                </div>
                <p className="text-sm text-gray-600">Вопрос 2</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">✓</span>
                </div>
                <p className="text-sm text-gray-600">Вопрос 3</p>
              </div>
            </div>

            <div className="pt-6 space-y-4">
              <p className="text-gray-500 text-sm">
                Результаты рассмотрения будут отправлены вам в течение 24 часов
              </p>
              
              <Button
                onClick={onRestart}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Пройти интервью заново
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompletionScreen;
