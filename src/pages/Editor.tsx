import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";

interface Clause {
  id: string;
  title: string;
  content: string;
}

const SAMPLE_CLAUSES: Clause[] = [
  {
    id: "1",
    title: "Identificação das Partes",
    content: "Entre {{NOME}}, portador do NIF {{NIF}}, com morada em {{MORADA}}, doravante designado por 'Primeira Parte'",
  },
  {
    id: "2",
    title: "Objeto do Contrato",
    content: "O presente contrato tem por objeto a prestação de serviços conforme descrito nos anexos.",
  },
  {
    id: "3",
    title: "Prazo de Vigência",
    content: "O presente contrato terá a duração de 12 (doze) meses, contados a partir da data da sua assinatura.",
  },
];

const Editor = () => {
  const [documentContent, setDocumentContent] = useState("");
  const [documentTitle, setDocumentTitle] = useState("Nova Minuta");
  const [previewValues, setPreviewValues] = useState({
    NIF: "",
    NOME: "",
    MORADA: "",
  });

  const insertClause = (clause: Clause) => {
    setDocumentContent((prev) => prev + "\n\n" + clause.content);
    toast.success(`Cláusula "${clause.title}" inserida`);
  };

  const replaceVariables = (text: string) => {
    let result = text;
    Object.entries(previewValues).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, "g"), value || `{{${key}}}`);
    });
    return result;
  };

  const handleDownload = () => {
    const finalContent = replaceVariables(documentContent);
    const blob = new Blob([finalContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `${documentTitle}.txt`;
    a.click();
    toast.success("Documento exportado");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" asChild className="mb-4">
            <a href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Cláusulas
            </a>
          </Button>
          <div className="flex items-center gap-4 mb-2">
            <FileText className="h-8 w-8 text-primary" />
            <Input
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 max-w-md"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1 p-6 h-fit">
            <h2 className="font-semibold text-lg mb-4">Cláusulas Disponíveis</h2>
            <div className="space-y-2">
              {SAMPLE_CLAUSES.map((clause) => (
                <Button
                  key={clause.id}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => insertClause(clause)}
                >
                  <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{clause.title}</span>
                </Button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-3">Valores de Teste</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="nif" className="text-xs">NIF</Label>
                  <Input
                    id="nif"
                    value={previewValues.NIF}
                    onChange={(e) =>
                      setPreviewValues({ ...previewValues, NIF: e.target.value })
                    }
                    placeholder="123456789"
                  />
                </div>
                <div>
                  <Label htmlFor="nome" className="text-xs">NOME</Label>
                  <Input
                    id="nome"
                    value={previewValues.NOME}
                    onChange={(e) =>
                      setPreviewValues({ ...previewValues, NOME: e.target.value })
                    }
                    placeholder="João Silva"
                  />
                </div>
                <div>
                  <Label htmlFor="morada" className="text-xs">MORADA</Label>
                  <Input
                    id="morada"
                    value={previewValues.MORADA}
                    onChange={(e) =>
                      setPreviewValues({ ...previewValues, MORADA: e.target.value })
                    }
                    placeholder="Rua Exemplo, 123"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-3 space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg">Editor</h2>
                <Button onClick={handleDownload} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
              <Textarea
                value={documentContent}
                onChange={(e) => setDocumentContent(e.target.value)}
                placeholder="Comece a escrever ou adicione cláusulas da lista ao lado..."
                className="min-h-[400px] font-mono"
              />
            </Card>

            <Card className="p-6">
              <h2 className="font-semibold text-lg mb-4">Pré-visualização</h2>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap font-serif text-foreground bg-card p-6 rounded-lg border min-h-[300px]">
                  {replaceVariables(documentContent) || "A pré-visualização aparecerá aqui..."}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
