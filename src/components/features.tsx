import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"

export default function FeatureComponent() {
  const features = [
    {
      title: "Track balances",
      description: "Keep track of your expenses, balances",
      image: "/home3.png?height=600&width=300",
      color: "bg-zinc-800",
    },
    {
      title: "Organize expenses",
      description: "Split expenses in any category: trips, household, couples, friends.",
      image: "/home2.png?height=600&width=300",
      color: "bg-emerald-500",
    },
    {
      title: "Organise Bills",
      description: "Quickly add Bills, and organise them based on category.",
      image: "/bills.png?height=600&width=300",
      color: "bg-orange-500",
    },
    {
      title: "Settle With Friends",
      description: "Settle up with a friend and record any cash or online payment.",
      image: "/friends.png?height=600&width=300",
      color: "bg-purple-800",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
      {features.map((feature, index) => (
        <Card
          key={index}
          className={`border-0 rounded-none ${feature.color} ${
            index === features.length  ? "md:col-span-2" : ""
          }`}
        >
          <div className="max-w-2xl mx-auto p-8 md:p-12 flex flex-col items-center min-h-[400px]">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-white mb-2">{feature.title}</CardTitle>
              <p className="text-white/80">{feature.description}</p>
            </CardHeader>
            <CardContent className="flex-1 w-full max-w-[300px] mx-auto">
              <img
                src={feature.image}
                alt={`${feature.title} illustration`}
                className="w-full h-auto object-contain"
              />
            </CardContent>
            {feature.hasButton && (
              <CardFooter>
                <Button variant="outline" className="bg-white text-purple-600 hover:bg-white/90">
                  Sign Up
                </Button>
              </CardFooter>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}