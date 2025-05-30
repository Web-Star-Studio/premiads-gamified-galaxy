import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { X, ArrowUp, ArrowDown } from 'lucide-react'
import { FormField, FormData } from './types'

interface SurveyFormBuilderProps {
  formData: FormData
  updateFormData: (field: string, value: any) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const fieldTypes = [
  { value: 'text', label: 'Texto' },
  { value: 'textarea', label: 'Texto Longo' },
  { value: 'select', label: 'Múltipla Escolha' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'file', label: 'Upload de Arquivo' }
]

export default function SurveyFormBuilder({ formData, updateFormData, open, onOpenChange }: SurveyFormBuilderProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = open !== undefined && onOpenChange !== undefined
  const dialogOpen = isControlled ? open : internalOpen
  const setDialogOpen = isControlled ? onOpenChange! : setInternalOpen
  const [fields, setFields] = useState<FormField[]>(formData.formSchema || [])
  const [newFieldLabel, setNewFieldLabel] = useState('')
  const [newFieldType, setNewFieldType] = useState<'text' | 'textarea' | 'select' | 'checkbox' | 'file'>('text')
  const [newFieldOptions, setNewFieldOptions] = useState('')

  useEffect(() => {
    setFields(formData.formSchema || [])
  }, [formData.formSchema])

  const addField = () => {
    if (!newFieldLabel.trim()) return
    const id = `${newFieldType}-${Date.now()}`
    const newField: FormField = {
      id,
      label: newFieldLabel.trim(),
      type: newFieldType,
      options: newFieldType === 'select' ? newFieldOptions.split(',').map(o => o.trim()) : undefined
    }
    setFields(prev => [...prev, newField])
    setNewFieldLabel('')
    setNewFieldType('text')
    setNewFieldOptions('')
  }

  const removeField = (id: string) => setFields(prev => prev.filter(f => f.id !== id))
  const moveFieldUp = (index: number) => {
    if (index === 0) return
    const next = [...fields]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    setFields(next)
  }
  const moveFieldDown = (index: number) => {
    if (index === fields.length - 1) return
    const next = [...fields]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    setFields(next)
  }

  const handleSave = () => {
    updateFormData('formSchema', fields)
    setDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setDialogOpen(true)}>Configurar Formulário</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Construtor de Formulário</DialogTitle>
            <DialogDescription>
              Adicione, edite e organize os campos do formulário.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
              <Input
                placeholder="Rótulo do campo"
                value={newFieldLabel}
                onChange={e => setNewFieldLabel(e.target.value)}
                className="sm:col-span-2"
              />
              <Select
                value={newFieldType}
                onValueChange={value => setNewFieldType(value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fieldTypes.map(ft => (
                    <SelectItem key={ft.value} value={ft.value}>
                      {ft.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {newFieldType === 'select' && (
                <Input
                  placeholder="Opções separadas por vírgula"
                  value={newFieldOptions}
                  onChange={e => setNewFieldOptions(e.target.value)}
                  className="sm:col-span-3"
                />
              )}
              <Button onClick={addField}>Adicionar Campo</Button>
            </div>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <p className="font-medium">
                      {field.label} - {fieldTypes.find(ft => ft.value === field.type)?.label}
                    </p>
                    {field.options && (
                      <p className="text-xs text-gray-400">
                        Opções: {field.options.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => moveFieldUp(index)}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => moveFieldDown(index)}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeField(field.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Summary removed for compact display */}
    </div>
  )
} 