import { useState, type FormEvent } from "react"
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
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)

  async function fazerLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    try {
      setLoading(true)

      let resposta = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: senha }),
      })

      if (resposta.ok) {
        const data = await resposta.json()
        const user = data.user
        
        localStorage.setItem("token", data.accessToken)
        localStorage.setItem("userId", String(user.id))
        localStorage.setItem("userName", user.name)
        localStorage.setItem("userEmail", user.email)
        
        // Verifica as permissões para definir o tipo de usuário no localStorage
        if (user.permissions && user.permissions.includes("ALUNO")) {
            localStorage.setItem("userType", "ALUNO")
        } else if (user.permissions && user.permissions.includes("EMPRESA")) {
            localStorage.setItem("userType", "EMPRESA")
        } else {
            localStorage.setItem("userType", "USUARIO")
        }

        alert("Login realizado com sucesso!")
        window.location.href = "/"
        return
      } else {
        alert("Email ou senha inválidos")
      }
    } catch (error) {
      console.error("Erro no login:", error)
      alert("Erro ao conectar com o backend")
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

              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>

                <FieldDescription className="text-center">
                  Ainda não tem conta? <a href="/CadastroAluno">Cadastre-se</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}