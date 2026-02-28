import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Flame, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Login() {
  const { demoLogin, adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemo = () => {
    demoLogin();
    navigate('/');
  };

  const handleAdmin = () => {
    adminLogin();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary/10 via-background to-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4 mx-auto">
            <Flame className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl">Willkommen zurück</CardTitle>
          <CardDescription>Melde dich an, um deine Sammlung zu verwalten</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleDemo(); }}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="sammler@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full">
              Anmelden
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Oder</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={handleDemo}>
              <User className="w-4 h-4 mr-2" />
              Demo-Account verwenden
            </Button>
            <Button variant="outline" className="w-full" onClick={handleAdmin}>
              <Shield className="w-4 h-4 mr-2" />
              Als Admin anmelden
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Noch kein Account? <span className="text-primary cursor-pointer hover:underline">Jetzt registrieren</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
