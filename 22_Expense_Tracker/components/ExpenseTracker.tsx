'use client'

import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'

import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { Dialog } from 'primereact/dialog'
import { Card } from 'primereact/card'
import { TabView, TabPanel } from 'primereact/tabview'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: Date
}

const CATEGORIES = [
  { label: 'Food & Dining', value: 'food', icon: 'pi-shopping-cart' },
  { label: 'Transportation', value: 'transport', icon: 'pi-car' },
  { label: 'Entertainment', value: 'entertainment', icon: 'pi-star' },
  { label: 'Utilities', value: 'utilities', icon: 'pi-bolt' },
  { label: 'Healthcare', value: 'healthcare', icon: 'pi-heart' },
  { label: 'Shopping', value: 'shopping', icon: 'pi-shopping-bag' },
  { label: 'Bills', value: 'bills', icon: 'pi-credit-card' },
  { label: 'Other', value: 'other', icon: 'pi-circle' },
]

const CATEGORY_COLORS: Record<string, string> = {
  food: '#FF6384',
  transport: '#36A2EB',
  entertainment: '#FFCE56',
  utilities: '#4BC0C0',
  healthcare: '#9966FF',
  shopping: '#FF9F40',
  bills: '#FF6384',
  other: '#C9CBCF',
}

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [displayDialog, setDisplayDialog] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [formData, setFormData] = useState({
    description: '',
    amount: 0,
    category: 'food',
    date: new Date(),
  })
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const toastRef = React.useRef<any>(null)

  // Load expenses from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('expenses')
    if (stored) {
      const parsed = JSON.parse(stored)
      setExpenses(
        parsed.map((exp: any) => ({
          ...exp,
          date: new Date(exp.date),
        }))
      )
    }
  }, [])

  // Save expenses to localStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  const openNew = () => {
    setEditingExpense(null)
    setFormData({
      description: '',
      amount: 0,
      category: 'food',
      date: new Date(),
    })
    setDisplayDialog(true)
  }

  const hideDialog = () => {
    setDisplayDialog(false)
  }

  const saveExpense = () => {
    if (!formData.description || formData.amount <= 0) {
      toastRef.current?.show({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill all fields correctly',
      })
      return
    }

    if (editingExpense) {
      setExpenses(
        expenses.map((exp) =>
          exp.id === editingExpense.id
            ? {
                ...editingExpense,
                ...formData,
              }
            : exp
        )
      )
      toastRef.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Expense updated successfully',
      })
    } else {
      const newExpense: Expense = {
        id: Date.now().toString(),
        ...formData,
      }
      setExpenses([newExpense, ...expenses])
      toastRef.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Expense added successfully',
      })
    }

    setDisplayDialog(false)
  }

  const editExpense = (expense: Expense) => {
    setEditingExpense(expense)
    setFormData({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
      date: new Date(expense.date),
    })
    setDisplayDialog(true)
  }

  const deleteExpense = (expense: Expense) => {
    confirmDialog({
      message: 'Are you sure you want to delete this expense?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'reject',
      accept: () => {
        setExpenses(expenses.filter((exp) => exp.id !== expense.id))
        toastRef.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Expense deleted successfully',
        })
      },
    })
  }

  const getCategoryLabel = (value: string) => {
    return CATEGORIES.find((cat) => cat.value === value)?.label || value
  }

  const getCategoryIcon = (value: string) => {
    return CATEGORIES.find((cat) => cat.value === value)?.icon || 'pi-circle'
  }

  // Filtering
  const filteredExpenses = expenses.filter((exp) => {
    const matchesCategory = !selectedCategory || exp.category === selectedCategory
    const matchesSearch = !searchTerm || exp.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Statistics
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)
  const categoryTotals = CATEGORIES.map((cat) => ({
    label: cat.label,
    value: filteredExpenses
      .filter((exp) => exp.category === cat.value)
      .reduce((sum, exp) => sum + exp.amount, 0),
    category: cat.value,
  }))

  const expensesByMonth = filteredExpenses.reduce(
    (acc, exp) => {
      const month = new Date(exp.date).toLocaleString('default', { month: 'short', year: 'numeric' })
      acc[month] = (acc[month] || 0) + exp.amount
      return acc
    },
    {} as Record<string, number>
  )

  const doughnutData = {
    labels: categoryTotals.map((ct) => ct.label),
    datasets: [
      {
        data: categoryTotals.map((ct) => ct.value),
        backgroundColor: categoryTotals.map((ct) => CATEGORY_COLORS[ct.category]),
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  }

  const barData = {
    labels: Object.keys(expensesByMonth).sort(),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: Object.keys(expensesByMonth)
          .sort()
          .map((month) => expensesByMonth[month]),
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  const dateBodyTemplate = (rowData: Expense) => {
    return new Date(rowData.date).toLocaleDateString()
  }

  const categoryBodyTemplate = (rowData: Expense) => {
    const icon = getCategoryIcon(rowData.category)
    return (
      <div className="flex items-center gap-2">
        <i className={`pi ${icon}`}></i>
        <span>{getCategoryLabel(rowData.category)}</span>
      </div>
    )
  }

  const amountBodyTemplate = (rowData: Expense) => {
    return `$${rowData.amount.toFixed(2)}`
  }

  const actionBodyTemplate = (rowData: Expense) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="p-button-warning"
          onClick={() => editExpense(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          className="p-button-danger"
          onClick={() => deleteExpense(rowData)}
        />
      </div>
    )
  }

  const dialogHeader = editingExpense ? 'Edit Expense' : 'Add New Expense'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <Toast ref={toastRef} />
      <ConfirmDialog />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Expense Tracker</h1>
          <p className="text-gray-600">Manage and track your expenses efficiently</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Expenses</p>
                <p className="text-3xl font-bold text-gray-800">${totalExpenses.toFixed(2)}</p>
              </div>
              <i className="pi pi-wallet text-4xl text-blue-500"></i>
            </div>
          </Card>

          <Card className="bg-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Transactions</p>
                <p className="text-3xl font-bold text-gray-800">{filteredExpenses.length}</p>
              </div>
              <i className="pi pi-list text-4xl text-green-500"></i>
            </div>
          </Card>

          <Card className="bg-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Average Expense</p>
                <p className="text-3xl font-bold text-gray-800">
                  ${(filteredExpenses.length > 0 ? totalExpenses / filteredExpenses.length : 0).toFixed(2)}
                </p>
              </div>
              <i className="pi pi-chart-bar text-4xl text-purple-500"></i>
            </div>
          </Card>

          <Card className="bg-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Categories</p>
                <p className="text-3xl font-bold text-gray-800">{CATEGORIES.length}</p>
              </div>
              <i className="pi pi-tag text-4xl text-orange-500"></i>
            </div>
          </Card>
        </div>

        {/* Main Tabs */}
        <TabView>
          {/* Expenses Tab */}
          <TabPanel header="Expenses" leftIcon="pi pi-list">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Controls */}
              <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <InputText
                    placeholder="Search by description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <Dropdown
                  value={selectedCategory}
                  options={[
                    { label: 'All Categories', value: null },
                    ...CATEGORIES.map((cat) => ({
                      label: cat.label,
                      value: cat.value,
                    })),
                  ]}
                  onChange={(e) => setSelectedCategory(e.value)}
                  placeholder="Filter by category"
                  className="w-full md:w-48"
                />

                <Button
                  label="Add Expense"
                  icon="pi pi-plus"
                  onClick={openNew}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                />
              </div>

              {/* Data Table */}
              <DataTable
                value={filteredExpenses}
                paginator
                rows={10}
                tableStyle={{ minWidth: '50rem' }}
                className="bg-white"
                emptyMessage="No expenses found."
              >
                <Column field="description" header="Description" style={{ width: '25%' }} />
                <Column
                  field="date"
                  header="Date"
                  body={dateBodyTemplate}
                  style={{ width: '20%' }}
                  sortable
                />
                <Column
                  field="category"
                  header="Category"
                  body={categoryBodyTemplate}
                  style={{ width: '25%' }}
                  sortable
                />
                <Column
                  field="amount"
                  header="Amount"
                  body={amountBodyTemplate}
                  style={{ width: '15%' }}
                  sortable
                />
                <Column
                  body={actionBodyTemplate}
                  header="Actions"
                  style={{ width: '15%' }}
                  exportable={false}
                  frozen
                  alignFrozen="right"
                />
              </DataTable>
            </div>
          </TabPanel>

          {/* Analytics Tab */}
          <TabPanel header="Analytics" leftIcon="pi pi-chart-bar">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* Category Distribution */}
              <Card className="bg-white shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Expenses by Category</h2>
                {totalExpenses > 0 ? (
                  <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Doughnut data={doughnutData} options={chartOptions} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    No data available
                  </div>
                )}
              </Card>

              {/* Monthly Trend */}
              <Card className="bg-white shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Trend</h2>
                {totalExpenses > 0 ? (
                  <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bar data={barData} options={barChartOptions} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    No data available
                  </div>
                )}
              </Card>

              {/* Category Breakdown */}
              <Card className="bg-white shadow-md lg:col-span-2">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Category Breakdown</h2>
                <div className="space-y-3">
                  {categoryTotals.map((ct) => (
                    <div key={ct.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[ct.category] }}
                        ></div>
                        <span className="text-gray-700">{ct.label}</span>
                      </div>
                      <span className="font-bold text-gray-800">${ct.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabPanel>

          {/* Summary Tab */}
          <TabPanel header="Summary" leftIcon="pi pi-home">
            <div className="p-6 bg-white rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Monthly Summary */}
                <Card className="bg-white shadow-md">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Summary</h2>
                  <div className="space-y-2">
                    {Object.entries(expensesByMonth)
                      .sort()
                      .map(([month, amount]) => (
                        <div key={month} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                          <span className="text-gray-700">{month}</span>
                          <span className="font-bold text-gray-800">${amount.toFixed(2)}</span>
                        </div>
                      ))}
                  </div>
                </Card>

                {/* Quick Stats */}
                <Card className="bg-white shadow-md">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-2 border-b border-gray-200">
                      <span className="text-gray-700">Total Expenses:</span>
                      <span className="text-2xl font-bold text-blue-600">${totalExpenses.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 border-b border-gray-200">
                      <span className="text-gray-700">Total Transactions:</span>
                      <span className="text-2xl font-bold text-green-600">{filteredExpenses.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-2">
                      <span className="text-gray-700">Average Per Transaction:</span>
                      <span className="text-2xl font-bold text-purple-600">
                        ${(filteredExpenses.length > 0 ? totalExpenses / filteredExpenses.length : 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabPanel>
        </TabView>

        {/* Add/Edit Dialog */}
        <Dialog header={dialogHeader} visible={displayDialog} style={{ width: '90vw', maxWidth: '400px' }} onHide={hideDialog} modal>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <InputText
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Enter expense description"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                <InputText
                  value={formData.amount.toString()}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0
                    setFormData({ ...formData, amount: val })
                  }}
                  className="w-full pl-7 p-2 border border-gray-300 rounded"
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <Dropdown
                value={formData.category}
                options={CATEGORIES.map((cat) => ({
                  label: cat.label,
                  value: cat.value,
                }))}
                onChange={(e) => setFormData({ ...formData, category: e.value })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
              <Calendar
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.value || new Date() })}
                showIcon
                className="w-full"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={hideDialog}
                className="p-button-text"
              />
              <Button
                label="Save"
                icon="pi pi-check"
                onClick={saveExpense}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              />
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  )
}
