export function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">
          © {new Date().getFullYear()} Wesley Reis. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}