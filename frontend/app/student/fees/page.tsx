'use client';

import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useFeeStore } from '@/lib/stores/feeStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { feeService } from '@/lib/api/services/feeService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { PaymentStatus } from '@/lib/types';

export default function StudentFeesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  
  const payments = useFeeStore((state) => state.payments);
  const setPayments = useFeeStore((state) => state.setPayments);
  const studentFeeRecords = useFeeStore((state) => state.studentFeeRecords);
  const setStudentFeeRecords = useFeeStore((state) => state.setStudentFeeRecords);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        if (!user) return;

        const [paymentsRes, feeRes] = await Promise.all([
          feeService.getPayments(user.id),
          feeService.getAllStudentFeeRecords(),
        ]);

        if (paymentsRes.success && paymentsRes.data) setPayments(paymentsRes.data);
        if (feeRes.success && feeRes.data) setStudentFeeRecords(feeRes.data);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setPayments, setStudentFeeRecords, user]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner text="Loading fees..." />
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

  const feeRecord = studentFeeRecords.length > 0 ? studentFeeRecords[0] : null;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Fee Management</h1>
          <p className="text-slate-400 mt-2">Track and pay your school fees</p>
        </div>

        {feeRecord && (
          <>
            {/* Fee Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-300 text-sm font-semibold">Total Fees</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">
                    ₹{feeRecord.totalFeeAmount.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-green-900/20 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-green-300 text-sm font-semibold">Paid Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-400">
                    ₹{feeRecord.paidAmount.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-red-900/20 border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-red-300 text-sm font-semibold">Pending Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-red-400">
                    ₹{feeRecord.pendingAmount.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Payment Progress */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Payment Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">
                      {Math.round((feeRecord.paidAmount / feeRecord.totalFeeAmount) * 100)}% Completed
                    </span>
                    <span className="text-slate-400">
                      ₹{feeRecord.paidAmount.toLocaleString()} / ₹{feeRecord.totalFeeAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all"
                      style={{
                        width: `${(feeRecord.paidAmount / feeRecord.totalFeeAmount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

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

            {/* Payment Button */}
            {feeRecord.pendingAmount > 0 && (
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12">
                Pay Pending Amount: ₹{feeRecord.pendingAmount.toLocaleString()}
              </Button>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
