import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function fazerLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro(null)

    try {
      setLoading(true)
      const resposta = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha }),
      })

      if (!resposta.ok) {
        setErro("Email ou senha inválidos.")
        return
      }

      const data = await resposta.json()
      const { accessToken, user } = data

      localStorage.setItem("token", accessToken)
      localStorage.setItem("userId", String(user.id))
      localStorage.setItem("userName", user.name)
      localStorage.setItem("userEmail", user.email)

      if (user.permissions?.includes("ALUNO")) {
        localStorage.setItem("userType", "ALUNO")
        navigate("/aluno/home")
      } else if (user.permissions?.includes("EMPRESA")) {
        localStorage.setItem("userType", "EMPRESA")
        navigate("/empresa/home")
      } else {
        localStorage.setItem("userType", "USUARIO")
        navigate("/")
      }
    } catch {
      setErro("Erro ao conectar com o servidor.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Entrar na conta</CardTitle>
          <CardDescription>
            Informe seu email e senha para acessar o sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={fazerLogin}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="seuemail@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="senha">Senha</FieldLabel>
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </Field>

              {erro && (
                <p className="text-sm text-destructive">{erro}</p>
              )}

              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
                <FieldDescription className="text-center">
                  Ainda não tem conta?{" "}
                  <a href="/cadastro/aluno" className="underline">
                    Cadastre-se
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}