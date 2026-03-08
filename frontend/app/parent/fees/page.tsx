'use client';

import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useFeeStore } from '@/lib/stores/feeStore';
import { feeService } from '@/lib/api/services/feeService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { PaymentStatus } from '@/lib/types';

export default function ParentFeesPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  const payments = useFeeStore((state) => state.payments);
  const setPayments = useFeeStore((state) => state.setPayments);
  const studentFeeRecords = useFeeStore((state) => state.studentFeeRecords);
  const setStudentFeeRecords = useFeeStore((state) => state.setStudentFeeRecords);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [paymentsRes, feeRes] = await Promise.all([
          feeService.getPayments(),
          feeService.getAllStudentFeeRecords(),
        ]);

        if (paymentsRes.success && paymentsRes.data) setPayments(paymentsRes.data);
        if (feeRes.success && feeRes.data) setStudentFeeRecords(feeRes.data);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setPayments, setStudentFeeRecords]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner text="Loading fee information..." />
        </div>
      </MainLayout>
    );
  }

  const getStatusIcon = (status: PaymentStatus) => {
    if (status === PaymentStatus.COMPLETED) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
    return <AlertCircle className="w-5 h-5 text-yellow-400" />;
  };

  const getStatusColor = (status: PaymentStatus) => {
    const colors = {
      completed: 'bg-green-500/20 text-green-300',
      pending: 'bg-yellow-500/20 text-yellow-300',
      failed: 'bg-red-500/20 text-red-300',
      refunded: 'bg-blue-500/20 text-blue-300',
    };
    return colors[status];
  };

  const totalFees = studentFeeRecords.reduce((sum, record) => sum + record.totalFeeAmount, 0);
  const totalPaid = studentFeeRecords.reduce((sum, record) => sum + record.paidAmount, 0);
  const totalPending = studentFeeRecords.reduce((sum, record) => sum + record.pendingAmount, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Fees Management</h1>
          <p className="text-slate-400 mt-2">View and manage all children's fees</p>
        </div>

        {/* Overall Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-300 text-sm font-semibold">Total Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">₹{totalFees.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="bg-green-900/20 border-green-500/30">
            <CardHeader>
              <CardTitle className="text-green-300 text-sm font-semibold">Paid Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-400">₹{totalPaid.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="bg-red-900/20 border-red-500/30">
            <CardHeader>
              <CardTitle className="text-red-300 text-sm font-semibold">Pending Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-400">₹{totalPending.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Overall Payment Progress */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Overall Payment Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">
                  {totalFees > 0 ? Math.round((totalPaid / totalFees) * 100) : 0}% Completed
                </span>
                <span className="text-slate-400">
                  ₹{totalPaid.toLocaleString()} / ₹{totalFees.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{
                    width: totalFees > 0 ? `${(totalPaid / totalFees) * 100}%` : '0%',
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fee Details by Student */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Student Fee Details</h2>
          {studentFeeRecords.map((record) => (
            <Card key={record.id} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">Student ID: {record.studentId}</CardTitle>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      record.pendingAmount === 0
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}
                  >
                    {record.pendingAmount === 0 ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-slate-900/50 rounded-lg">
                    <p className="text-slate-400 text-sm">Total</p>
                    <p className="text-white font-bold">₹{record.totalFeeAmount.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-green-400 text-sm">Paid</p>
                    <p className="text-green-400 font-bold">₹{record.paidAmount.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    <p className="text-red-400 text-sm">Pending</p>
                    <p className="text-red-400 font-bold">₹{record.pendingAmount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-700">
                    <Download className="w-4 h-4 mr-2" />
                    Receipt
                  </Button>
                  {record.pendingAmount > 0 && (
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Pay ₹{record.pendingAmount.toLocaleString()}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment History */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-400" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length > 0 ? (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(payment.status)}
                      <div>
                        <p className="text-white font-semibold">
                          ₹{payment.amount.toLocaleString()}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {new Date(payment.paymentDate).toLocaleDateString()} • {payment.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.status)}`}
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">No payment history yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
