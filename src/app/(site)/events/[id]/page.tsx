import { Card, CardContent } from "@/components/ui/card";
import SignUpEvents from "@/features/Events/SignUpEvents/components/SignUpEvents";

export default function page() {
  return (
    <div className=" flex justify-center p-15">
      <Card>
       
        <CardContent>
      <SignUpEvents />
    </CardContent>
        
        
      </Card>
    </div>
  );
}
