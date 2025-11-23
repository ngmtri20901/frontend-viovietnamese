import Image from "next/image";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto px-6 md:px-12 xl:px-24 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              We build finance software to empower businesses
            </h1>
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-6 text-lg rounded-md">
              View Opportunities
            </Button>
          </div>
          <div className="relative">
             {/* Abstract shapes and collage */}
             <div className="relative aspect-square w-full max-w-lg mx-auto lg:max-w-none">
                <Image
                  src="/about/hero-collage.png"
                  alt="Team Collage"
                  fill
                  className="object-contain"
                  priority
                />
             </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 md:px-12 xl:px-24 py-16 md:py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
           <h2 className="text-4xl font-bold max-w-xs">We do this differently</h2>
           <p className="text-lg text-gray-600 leading-relaxed max-w-md">
             Erat eleifend lacus mattis at porttitor at mauris vel pharetra. Consequat, dictum
           </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
           <div>
              <div className="text-4xl font-bold mb-2">50K</div>
              <div className="font-semibold mb-2">Global Users</div>
              <p className="text-sm text-gray-500">This is a larger number than the other two numbers.</p>
           </div>
           <div>
              <div className="text-4xl font-bold mb-2">700+</div>
              <div className="font-semibold mb-2">5 Start Reviews</div>
              <p className="text-sm text-gray-500">A modest number to start off metrics section.</p>
           </div>
           <div>
              <div className="text-4xl font-bold mb-2">40%</div>
              <div className="font-semibold mb-2">Upto Savings rate</div>
              <p className="text-sm text-gray-500">Earn the best rewards and establish credit history</p>
           </div>
           <div>
              <div className="text-4xl font-bold mb-2">60</div>
              <div className="font-semibold mb-2">Team Members</div>
              <p className="text-sm text-gray-500">That's a massive increase over previous performance.</p>
           </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-6 md:px-12 xl:px-24 py-16 md:py-24 bg-gray-50/50">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Column 1 */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-6">We&apos;re driven by our values</h2>
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8">
                View Opportunities
              </Button>
            </div>
            
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Selflessness</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Varius diam consectetur pellentesque commodo. Volutpat gravida bibendum sit nunc. Et velit eu a, amet in
                </p>
                <div className="relative h-48 w-full rounded-t-full overflow-hidden bg-pink-100 mt-4">
                   <Image
                      src="/about/value-selflessness.png"
                      alt="Selflessness"
                      fill
                      className="object-cover"
                   />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 2 */}
          <div className="space-y-8 pt-0 lg:pt-12">
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Collaboration</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Erat eleifend lacus mattis at porttitor at mauris vel pharetra. Consequat, dictum et magna augue.
                </p>
                <div className="relative h-48 w-full rounded-t-full overflow-hidden bg-purple-100 mt-4">
                    <Image
                      src="/about/value-collaboration.png"
                      alt="Collaboration"
                      fill
                      className="object-cover"
                   />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Have Fun Building</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Feugiat aliquam elementum suspendisse eget in. Blandit ac tellus, etiam nunc.
                </p>
                <div className="relative h-48 w-full rounded-t-full overflow-hidden bg-orange-100 mt-4">
                   <Image
                      src="/about/value-fun.png"
                      alt="Have Fun Building"
                      fill
                      className="object-cover"
                   />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 3 */}
          <div className="space-y-8">
             <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Growth Mindset</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Dapibus massa id duis commodo mauris non lacus porttitor sed. Nibh vitae, tellus eros nibh eget.
                </p>
                <div className="relative h-48 w-full rounded-t-full overflow-hidden bg-yellow-100 mt-4">
                    <Image
                      src="/about/value-growth.png"
                      alt="Growth Mindset"
                      fill
                      className="object-cover"
                   />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Trust and Respect</h3>
                <p className="text-gray-600 mb-6 text-sm">
                  Laculis blandit dolor ac ultricies duis quam malesuada fermentum viverra. Pellentesque non sem scelerisque.
                </p>
                <div className="relative h-48 w-full rounded-t-full overflow-hidden bg-blue-100 mt-4">
                    <Image
                      src="/about/value-trust.png"
                      alt="Trust and Respect"
                      fill
                      className="object-cover"
                   />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Milestone Section */}
      <section className="container mx-auto px-6 md:px-12 xl:px-24 py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            You guessed it. We&apos;re changing the game. Creating milestone
          </h2>
          <p className="text-gray-600 mb-12">
            Tellus faucibus pellentesque iaculis montes, pellentesque malesuada amet. Vestibulum, auctor lacus, metus eget. Praesent in diam elemen
          </p>

          <div className="space-y-8">
            {[
              { date: "October 2021", title: "Get 30M dollars funding" },
              { date: "July 2021", title: "Over 50+ team members" },
              { date: "February 2020", title: "Hit over 1M+ active users worldwide" },
              { date: "April 2019", title: "Launch our first beta version" },
              { date: "January 2019", title: "We started our journey" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-8 last:border-0">
                <div className="flex items-center mb-2 sm:mb-0">
                  <div className="w-2 h-2 bg-black rounded-full mr-4"></div>
                  <span className="font-bold text-lg">{item.date}</span>
                </div>
                <span className="text-gray-600 font-medium">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 md:px-12 xl:px-24 py-16 md:py-24">
        <div className="bg-blue-900 rounded-3xl p-12 md:p-24 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full opacity-50"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-blue-500 rounded-full opacity-20 blur-xl"></div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 max-w-2xl mx-auto leading-tight">
            Discover a better way to manage spendings
          </h2>
          <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-6 text-lg rounded-md">
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
}
