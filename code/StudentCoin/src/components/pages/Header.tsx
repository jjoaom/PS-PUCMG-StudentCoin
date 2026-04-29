import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { MdOutlineHome } from "react-icons/md";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "../ui/sheet";

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="text-lg font-semibold">
          <Link to="/">
            <MdOutlineHome size={28} />
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6">
          <Link
            to="/about"
            className="text-muted-foreground hover:text-foreground"
          >
            Sobre o projeto
          </Link>
          <Link
            to="/premios"
            className="text-muted-foreground hover:text-foreground"
          >
            Veja nossos benefícios
          </Link>
          <Link
            to="/parceiro"
            className="text-muted-foreground hover:text-foreground"
          >
            Empresas Parceiras
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Desktop */}
          <Link to="/login" className="hidden md:inline-flex">
            Login
          </Link>

          <Button className="hidden md:inline-flex">Cadastre-se</Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <FiMenu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-64">
              <nav className="flex flex-col gap-4 mt-6">
                <SheetClose asChild>
                  <Link
                    to="/about"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Sobre o projeto
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link
                    to="/premios"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Veja nossos benefícios
                  </Link>
                </SheetClose>

                <SheetClose asChild>
                  <Link
                    to="/parceiro"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Empresas Parceiras
                  </Link>
                </SheetClose>

                <div className="mt-4">
                  <Link to="/login" className="w-full">
                    Login
                  </Link>
                  <Button className="w-full">Cadastre-se</Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Header;
