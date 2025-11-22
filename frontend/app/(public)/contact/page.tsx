"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Mail, MessageSquare, MapPin, Phone } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { FAQSection } from "@/shared/components/marketing/contact/faq-sections";
import { Navbar } from "@/shared/components/layout/public/navbar";
import { Footer } from "@/shared/components/layout/public/footer";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  privacyPolicy: z.boolean().refine((val) => val === true, {
    message: "You must agree to the privacy policy",
  }),
});

function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      privacyPolicy: false,
    },
  });

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      if (!executeRecaptcha) {
        toast.error("ReCAPTCHA not loaded. Please refresh the page and try again.");
        return;
      }

      setIsSubmitting(true);

      try {
        const token = await executeRecaptcha("contact_submit");
        
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, recaptchaToken: token }),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success("Message sent successfully! We'll get back to you soon.");
          form.reset();
        } else {
          toast.error(result.error || "Failed to send message. Please try again.");
        }
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [executeRecaptcha, form]
  );

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your First Name"
                      {...field}
                      onBlur={(e) => {
                        field.onBlur();
                        form.trigger("firstName");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Last Name"
                      {...field}
                      onBlur={(e) => {
                        field.onBlur();
                        form.trigger("lastName");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email Address <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Email"
                      {...field}
                      onBlur={(e) => {
                        field.onBlur();
                        form.trigger("email");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Subject <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="billing">Billing Issue</SelectItem>
                    <SelectItem value="feedback">Product Feedback</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Your Message <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="How can we help you?"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="privacyPolicy"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to the{" "}
                    <a href="#" className="text-blue-600">
                      Privacy Policy
                    </a>
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormItem>
            <FormControl>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </FormControl>
          </FormItem>
        </form>
      </Form>
  );
}

export default function FeedbackPage() {
  // Get the site key from the public environment variable
  const siteKey = process.env.NEXT_PUBLIC_GOOGLE_reCAPTCHAv3_SITEKEY;

  if (!siteKey) {
    return (
      <div className="text-red-600 font-bold p-8 text-center">
        Google reCAPTCHA site key is missing. Please set NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY in your .env.local file.
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
        <div className="min-h-screen bg-white p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-4">Reach Us</h1>
              <h2 className="text-4xl font-bold mb-4">Speak with Our Friendly Team</h2>
              <p className="text-gray-600 text-lg">
                We'd love to assist you. Fill out the form or drop us an email.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-16">
              {/* Left Column - Contact Info */}
              <div className="space-y-12">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <Mail className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-600 mb-2">Email Us</h3>
                    <p className="text-gray-500 mb-2">Our team is ready to assist.</p>
                    <a href="mailto:abc@example.com" className="text-black font-medium">
                      abc@example.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <MessageSquare className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-600 mb-2">Live Chat Support</h3>
                    <p className="text-gray-500 mb-2">Reach out for quick help.</p>
                    <button className="text-black font-medium">Start a new chat</button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <MapPin className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-600 mb-2">Visit Us</h3>
                    <p className="text-gray-500 mb-2">Drop by our office for a chat.</p>
                    <p className="text-black font-medium">1234 Street Name, City Name</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <Phone className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-600 mb-2">Call Us</h3>
                    <p className="text-gray-500 mb-2">We're available Mon-Fri, 9am-5pm.</p>
                    <p className="text-black font-medium">+123 456 7890</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <div className="bg-gray-50 p-8 rounded-lg">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
        <main className="container mx-auto py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-2">
              We've got answers
            </h1>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
              This really should be an LLM but we're waiting for RAG to truly
              reach commodity stage before we touch it.
            </p>
            <FAQSection />
          </div>
        </main>
      </GoogleReCaptchaProvider>
      <Footer />
    </>
  );
}