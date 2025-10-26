import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Clause {
  id: string;
  title: string;
  content: string;
}

const DYNAMIC_FIELDS = ["{{NIF}}", "{{NOME}}", "{{MORADA}}"];

const Clauses = () => {
  const [clauses, setClauses] = useState<Clause[]>([
    {
      id: "1",
      title: "Identificação das Partes",
      content: "Entre {{NOME}}, portador do NIF {{NIF}}, com morada em {{MORADA}}, doravante designado por 'Primeira Parte'",
    },
  ]);
  const [editingClause, setEditingClause] = useState<Clause | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const insertField = (field: string) => {
    setContent((prev) => prev + " " + field + " ");
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (editingClause) {
      setClauses((prev) =>
        prev.map((c) =>
          c.id === editingClause.id ? { ...c, title, content } : c
        )
      );
      toast.success("Cláusula atualizada");
    } else {
      const newClause: Clause = {
        id: Date.now().toString(),
        title,
        content,
      };
      setClauses((prev) => [...prev, newClause]);
      toast.success("Cláusula criada");
    }

    resetForm();
  };

  const handleEdit = (clause: Clause) => {
    setEditingClause(clause);
    setTitle(clause.title);
    setContent(clause.content);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setClauses((prev) => prev.filter((c) => c.id !== id));
    toast.success("Cláusula eliminada");
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingClause(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Gestão de Cláusulas</h1>
          <p className="text-muted-foreground">Crie e gerencie as cláusulas para suas minutas</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()} className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Cláusula
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingClause ? "Editar Cláusula" : "Nova Cláusula"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Identificação das Partes"
                  />
                </div>
                <div>
                  <Label>Campos Dinâmicos</Label>
                  <div className="flex gap-2 mb-2">
                    {DYNAMIC_FIELDS.map((field) => (
                      <Button
                        key={field}
                        variant="outline"
                        size="sm"
                        onClick={() => insertField(field)}
                      >
                        {field}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="content">Conteúdo</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Digite o conteúdo da cláusula..."
                    rows={6}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>Salvar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" asChild>
            <a href="/editor">
              <FileText className="h-4 w-4 mr-2" />
              Ir para Editor
            </a>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clauses.map((clause) => (
            <Card key={clause.id} className="p-6 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg text-foreground">{clause.title}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(clause)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(clause.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{clause.content}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clauses;
