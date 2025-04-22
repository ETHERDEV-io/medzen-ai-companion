import { Link } from "react-router-dom";
import { Activity, Brain, Calendar, ChevronRight, Clock, Pill, Target, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const getTimeOfDayGreeting = () => {
  const hours = new Date().getHours();
  if (hours < 12) return "Good morning";
  if (hours < 18) return "Good afternoon";
  return "Good evening";
};

const Dashboard = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{getTimeOfDayGreeting()}</h1>
        <p className="text-muted-foreground mt-1">Welcome to your health dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link to="/symptom-checker">
                Use Symptom Checker
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link to="/ai-assistant">
                Ask the AI Assistant
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Symptoms</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Use symptom checker
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link to="/symptom-checker">Symptom Checker</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Medications</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Upcoming medications today
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link to="/medications">View Medications</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Health Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Active goals in progress
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link to="/health-goals">View Goals</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest health activities and entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Activity {i} will appear here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This will show your recent health activities once you start using the app
                    </p>
                  </div>
                  <small className="text-xs text-muted-foreground">Just now</small>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Health Assistant</CardTitle>
            <CardDescription>
              Your personal health companion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-accent/5 p-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="rounded-full bg-accent/10 p-2">
                  <Brain className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm">How can I help with your health today?</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8" asChild>
                  <Link to="/ai-assistant">What does my blood pressure mean?</Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8" asChild>
                  <Link to="/ai-assistant">How can I improve my sleep?</Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8" asChild>
                  <Link to="/ai-assistant">Explain my lab results</Link>
                </Button>
              </div>
            </div>
            <Button className="w-full" asChild>
              <Link to="/ai-assistant">Ask the AI Assistant</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
