'use client'

import React from 'react'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { ImageIcon, CalendarIcon } from 'lucide-react'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/Signup12/Ui/Button'
import { Input } from '@/components/Signup12/Ui/Input'
import { Textarea } from '@/components/Signup12/Ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Signup12/Ui/Select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/Signup12/Ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Signup12/Ui/card'
import { useToast } from '@/components/Signup12/Ui/use-toast'

const locations = ['Binakayan', 'Rosario', 'Cavite City', 'Bacoor']

const formSchema = z.object({
  image: z.instanceof(File).optional(),
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  location: z.string().min(1, { message: 'Please select a location.' }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Please enter a valid date.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }), // New field for email
})

export default function EventManagement() {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      location: '',
      date: '',
      description: '',
      email: '', // Default value for email
    },
  })

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/tiff': ['.tiff', '.tif'],
    },
    onDrop: (acceptedFiles) => {
      form.setValue('image', acceptedFiles[0])
      setPreviewImage(URL.createObjectURL(acceptedFiles[0]))
      toast({
        title: 'Image uploaded',
        description: 'Your image has been successfully uploaded.',
        variant: 'default', // Use 'default' instead of 'success'
      })
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData()
    formData.append('image', values.image || '')
    formData.append('title', values.title)
    formData.append('location', values.location)
    formData.append('date', values.date)
    formData.append('description', values.description)
    formData.append('email', values.email)

    const response = await fetch('/api/events', {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      toast({
        title: 'Event created',
        description: 'Your event has been successfully created.',
        variant: 'default', // Use 'default' for success case
      })
    } else {
      toast({
        title: 'Error',
        description: 'There was an error creating the event.',
        variant: 'destructive', // Use 'destructive' for error case
      })
    }
  }

  return (
    <div className="min-h-screen bg-background p-8 flex items-center justify-center">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Create Your Event</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-muted rounded-lg p-6 text-center cursor-pointer hover:border-primary transition duration-300"
              >
                <input {...getInputProps()} />
                {previewImage ? (
                  <Image src={previewImage} alt="Preview" width={300} height={200} className="mx-auto max-h-48 object-contain" />
                ) : (
                  <div className="text-muted-foreground">
                    <ImageIcon className="mx-auto h-12 w-12" />
                    <p>Drag n drop an image here, or click to select</p>
                    <p className="text-sm">(JPEG, PNG, GIF, TIFF)</p>
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                        <Input type="date" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter event description" className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">Create Event</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
