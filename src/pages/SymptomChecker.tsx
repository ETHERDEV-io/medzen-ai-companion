
import { useEffect, useState } from "react";
import { Search, Plus, X, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const COMMON_SYMPTOMS = [
  "Headache",
  "Fever",
  "Cough",
  "Fatigue",
  "Nausea",
  "Sore throat",
  "Muscle aches",
  "Runny nose",
  "Shortness of breath",
  "Chest pain",
  "Stomach ache",
  "Skin rash",
  "Dizziness",
  "Sweating",
];

export default function SymptomChecker() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState(COMMON_SYMPTOMS);

  useEffect(() => {
    if (!search) {
      setSuggestions(COMMON_SYMPTOMS.filter((s) => !selected.includes(s)));
    } else {
      const q = search.toLowerCase();
      setSuggestions(
        COMMON_SYMPTOMS.filter(
          (s) => !selected.includes(s) && s.toLowerCase().includes(q)
        ),
      );
    }
  }, [search, selected]);

  const addSymptom = (s: string) => {
    setSelected((sel) => (sel.includes(s) ? sel : [...sel, s]));
    setSearch("");
  };

  const removeSymptom = (s: string) => {
    setSelected((sel) => sel.filter((x) => x !== s));
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex gap-2 items-center">
          <Search className="w-6 h-6" /> Symptom Checker
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Select your symptoms or use the search below, then click "Analyze" to view insights. You can quickly add symptoms by clicking or typing; remove with the '×' button.
        </p>
      </div>
      <Card className="mb-8 shadow-md border-none">
        <CardHeader>
          <CardTitle className="text-lg">Your Symptoms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2 flex-wrap">
            {selected.map((s) => (
              <span key={s} className="bg-primary/10 rounded-full px-3 py-1 flex items-center gap-1 text-sm text-primary font-medium hover:bg-primary/20 transition">
                {s}
                <Button size="icon" className="w-5 h-5 text-muted-foreground" variant="ghost" onClick={() => removeSymptom(s)}>
                  <X className="w-3 h-3" />
                </Button>
              </span>
            ))}
            {selected.length === 0 && (
              <span className="text-muted-foreground text-sm">No symptoms selected.</span>
            )}
          </div>
          <div className="relative flex gap-2">
            <Input
              className="pr-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Start typing a symptom (e.g. headache)..."
              onKeyDown={e => {
                if (e.key === "Enter" && search.trim()) {
                  addSymptom(search.trim());
                }
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8"
              onClick={() => {
                if (search.trim()) addSymptom(search.trim());
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {suggestions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.slice(0, 8).map((sug) => (
                <Button
                  size="sm"
                  key={sug}
                  onClick={() => addSymptom(sug)}
                  variant="secondary"
                  className="rounded-full px-3 flex gap-1 items-center hover:bg-primary/10 hover:text-primary/90 transition"
                >
                  <Check className="w-3 h-3" /> {sug}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full mt-2"
            disabled={selected.length === 0}
            onClick={() => {
              document.getElementById("analysis")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Analyze Symptoms
          </Button>
        </CardFooter>
      </Card>
      <div id="analysis">
        <Card>
          <CardHeader>
            <CardTitle>Symptom Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {selected.length === 0 ? (
              <p className="text-muted-foreground">Add symptoms above to view analysis</p>
            ) : (
              <ul className="mb-3">
                {selected.map((s) => (
                  <li key={s} className="flex gap-2 items-center">
                    <Check className="text-green-500 w-4 h-4" /> {s}
                  </li>
                ))}
              </ul>
            )}
            <div className="rounded-md bg-muted px-4 py-3 mt-2 text-muted-foreground text-sm">
              AI analysis and possible health suggestions will appear in the next version.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
