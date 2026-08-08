import ProductForm from "@/components/ProductForm";
import ProductList from "@/components/ProductList";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function ProductsPage() {
  return (
    <main className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <div className="p-8">
          <ProductForm />
          <ProductList />
        </div>
      </div>
    </main>
  );
}