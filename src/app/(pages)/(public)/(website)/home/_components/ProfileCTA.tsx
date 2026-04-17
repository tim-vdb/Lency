import { Button } from "@/front/components/ui/button";
import { Card, CardContent } from "@/front/components/ui/card";

export default function ProfileCTA() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Card>
        <CardContent className="flex flex-col items-center text-center gap-4 sm:gap-6 py-10 sm:py-14 lg:py-16 px-6 sm:px-12 lg:px-24">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Choisis ton profil dès maintenant !
          </h2>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit, sed do eiusmod tempor incididunt
          </p>
          <Button
            variant="outline"
            className="mt-2 w-full max-w-xs rounded-xl border-gray-300 bg-[#F9B8B8] hover:bg-[#f5a0a0] text-gray-800 font-medium py-5 sm:py-6 text-sm sm:text-base"
          >
            Choisir
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}