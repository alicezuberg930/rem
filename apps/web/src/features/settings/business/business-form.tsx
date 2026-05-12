import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateBusiness } from '@/lib/repository/api'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { BusinessValidators } from '@/lib/validators/business'
import { Button } from '@/components/ui/button'
import {
  FormProvider,
  RHFSingleDatePicker,
  RHFTextArea,
  RHFTextField,
} from '@/components/hook-form'
import { RHFUpload } from '@/components/hook-form/RHFUpload'

export function BusinessForm() {
  const form = useForm<BusinessValidators.BusinessForm>({
    resolver: zodResolver(BusinessValidators.formSchema),
    defaultValues: {
      name: 'Rem Solution',
      description: 'Rem outsource company, a place for worshipping rem',
      slug: '',
      logoUrl: null,
      workStartTime: undefined,
      insuranceContributionSalary: '1000000',
    },
  })

  const { setValue, handleSubmit } = form

  const onSubmit = async (data: BusinessValidators.BusinessForm) => {
    // if (data.logoUrl instanceof File) {
    //   uploadFile(data.logoUrl, "/logo").then(res => data.logoUrl = res.data)
    // }
    try {
      await updateBusiness(data)
    } catch (error) {
      throw error
    }
    showSubmittedData(data)
  }

  const handleDropThumbnail = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return
      const img = new window.Image()
      img.src = URL.createObjectURL(file)
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
      setValue('logoUrl', newFile, { shouldValidate: true })
    },
    [setValue]
  )

  return (
    <FormProvider methods={form} onSubmit={handleSubmit(onSubmit)}>
      <RHFTextField name='name' fieldLabel='Your name' />
      <RHFTextArea name='description' fieldLabel='Business description' />
      <RHFSingleDatePicker
        name='dob'
        fieldLabel='Date of birth'
        placeholder='Pick a date'
      />
      <div className='flex gap-2'>
        <RHFTextField disabled name='slug' fieldLabel='Slug' />
        <RHFTextField
          type='time'
          name='workStartTime'
          fieldLabel='Work start time'
        />
      </div>
      <RHFTextField
        type='number'
        name='insuranceContributionSalary'
        fieldLabel='Insurance Contribution Salary'
      />
      <RHFUpload
        multiple={false}
        name='logoUrl'
        maxSize={15728640}
        onDrop={handleDropThumbnail}
        onDelete={() => setValue('logoUrl', null, { shouldValidate: true })}
        fieldLabel={'song_audio_file'}
      />
      {/* <FormField
          control={form.control}
          name='language'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Language</FormLabel>
              <Popover>
                <PopoverTrigger
                  render={
                    <FormControl>
                      <Button
                        variant='outline'
                        role='combobox'
                        className={cn(
                          'w-50 justify-between',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? languages.find((language) => language.value === field.value)?.label : 'Select language'}
                        <Cigarette className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </FormControl>
                  }
                >
                </PopoverTrigger>
                <PopoverContent className='w-50 p-0'>
                  <Command>
                    <CommandInput placeholder='Search language...' />
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {languages.map((language) => (
                          <CommandItem
                            value={language.label}
                            key={language.value}
                            onSelect={() => {
                              form.setValue('language', language.value)
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'size-4',
                                language.value === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {language.label}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the language that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
      <Button type='submit'>Update business</Button>
    </FormProvider>
  )
}
