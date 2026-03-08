'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Search, CheckCircle, XCircle } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { Permission } from '@/lib/permissions';
import { Transaction, TransactionStatus, TransactionType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function TransactionsPage() {
  const { toast } = useToast();
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      student_id: 101,
      amount: 500,
      type: 'DEPOSIT',
      status: 'COMPLETED',
      created_at: '2024-03-01T10:30:00Z',
    },
    {
      id: 2,
      student_id: 102,
      amount: 250,
      type: 'WITHDRAWAL',
      status: 'PENDING',
      created_at: '2024-03-05T14:00:00Z',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<TransactionStatus | 'ALL'>('ALL');
  const [filterType, setFilterType] = useState<TransactionType | 'ALL'>('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | undefined>();

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch = txn.student_id.toString().includes(searchQuery) || txn.id.toString().includes(searchQuery);
    const matchesStatus = filterStatus === 'ALL' || txn.status === filterStatus;
    const matchesType = filterType === 'ALL' || txn.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleApproveTransaction = (txn: Transaction) => {
    setTransactions(
      transactions.map((t) =>
        t.id === txn.id ? { ...t, status: 'COMPLETED' as TransactionStatus } : t
      )
    );
    toast({
      title: 'Success',
      description: 'Transaction approved',
    });
  };

  const handleRejectTransaction = (txn: Transaction) => {
    setTransactions(
      transactions.map((t) =>
        t.id === txn.id ? { ...t, status: 'REJECTED' as TransactionStatus } : t
      )
    );
    toast({
      title: 'Transaction Rejected',
      description: 'Transaction has been rejected',
    });
  };

  const handleDeleteTransaction = (txn: Transaction) => {
    setDeleteTarget(txn);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setTransactions(transactions.filter((t) => t.id !== deleteTarget.id));
      setDeleteConfirmOpen(false);
      setDeleteTarget(undefined);
      toast({
        title: 'Success',
        description: 'Transaction deleted successfully',
      });
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalAmount = filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  const deposits = filteredTransactions.filter((t) => t.type === 'DEPOSIT').length;
  const withdrawals = filteredTransactions.filter((t) => t.type === 'WITHDRAWAL').length;

  return (
    <MainLayout>
      <div className="space-y-6 font-georgia">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Transactions Management</h1>
            <p className="text-gray-400 mt-1">Manage student fee transactions and payments</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Total Amount</p>
                <p className="text-3xl font-bold text-blue-500">${totalAmount}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Deposits</p>
                <p className="text-3xl font-bold text-green-500">{deposits}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Withdrawals</p>
                <p className="text-3xl font-bold text-red-500">{withdrawals}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Total Transactions</p>
                <p className="text-3xl font-bold text-purple-500">{filteredTransactions.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle>Transaction Records</CardTitle>
            <CardDescription>All financial transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by student ID or transaction ID..."
                  className="pl-10 bg-slate-800 border-slate-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as TransactionType | 'ALL')}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              >
                <option value="ALL">All Types</option>
                <option value="DEPOSIT">Deposit</option>
                <option value="WITHDRAWAL">Withdrawal</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as TransactionStatus | 'ALL')}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((txn) => (
                      <TableRow key={txn.id} className="border-slate-700">
                        <TableCell>#{txn.id}</TableCell>
                        <TableCell>#{txn.student_id}</TableCell>
                        <TableCell className="font-bold">${txn.amount}</TableCell>
                        <TableCell>
                          <Badge variant={txn.type === 'DEPOSIT' ? 'default' : 'secondary'}>
                            {txn.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(txn.status)}>
                            {txn.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(txn.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <PermissionGuard permission={Permission.FEE_FULL}>
                              {txn.status === 'PENDING' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleApproveTransaction(txn)}
                                    title="Approve"
                                  >
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRejectTransaction(txn)}
                                    title="Reject"
                                  >
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteTransaction(txn)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </PermissionGuard>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <DeleteConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          onConfirm={handleConfirmDelete}
          title="Delete Transaction"
          description="Are you sure you want to delete this transaction? This action cannot be undone."
        />
      </div>
    </MainLayout>
  );
}
