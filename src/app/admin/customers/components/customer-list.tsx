'use client';

import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface CustomerListProps {
  customers: any[];
}

export function CustomerList({ customers }: CustomerListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Total Spent</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell className="font-medium">{customer.email}</TableCell>
            <TableCell>{customer.name || 'N/A'}</TableCell>
            <TableCell>
              {format(new Date(customer.createdAt), 'MMM d, yyyy')}
            </TableCell>
            <TableCell>
              <Badge variant="secondary">
                {customer.orders.length} orders
              </Badge>
            </TableCell>
            <TableCell>
              ${customer.orders
                .reduce((total: number, order: any) => total + order.total, 0)
                .toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}