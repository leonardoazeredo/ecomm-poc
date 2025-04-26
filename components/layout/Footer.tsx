export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-black border-t mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
        © {currentYear} MyEcommStore. All rights reserved.
      </div>
    </footer>
  );
}
