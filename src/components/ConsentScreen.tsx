
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ConsentScreenProps {
  onConsent: () => void;
}

const ConsentScreen: React.FC<ConsentScreenProps> = ({ onConsent }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Видео-интервью</h1>
          <p className="text-gray-600">Веб страница для захвата видео</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-blue-700">
              Согласие на прохождение видео-интервью
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <p className="text-gray-700 leading-relaxed">
                Уважаемый пользователь в целях повышения качества обслуживания и увеличения 
                вероятности одобрения кредита, вам необходимо пройти короткое видео-интервью. Следуйте 
                подсказкам на экране
              </p>
            </div>

            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader className="text-center pb-3">
                <CardTitle className="text-lg text-indigo-700">
                  СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ И ПРОХОЖДЕНИЕ ВИДЕО-ИНТЕРВЬЮ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Раздел 1.</h4>
                  <div className="border-b border-dotted border-gray-300 mb-3"></div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Раздел 2.</h4>
                  <div className="border-b border-dotted border-gray-300"></div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consent"
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  className="mt-1"
                />
                <label
                  htmlFor="consent"
                  className="text-sm text-gray-700 cursor-pointer leading-relaxed"
                >
                  Я ознакомился с условиями обработки персональных данных и даю согласие на 
                  прохождение видео-интервью
                </label>
              </div>
            </div>

            <div className="text-center pt-4">
              <Button
                onClick={onConsent}
                disabled={!agreed}
                className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
              >
                Продолжить для исследования
              </Button>
              {!agreed && (
                <p className="text-sm text-gray-500 mt-2">
                  Отметьте свое согласие для продолжения
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsentScreen;
