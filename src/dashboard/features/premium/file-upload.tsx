"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { PremiumRequestRecord } from "@/features/common/models";

interface Props {
  onDataLoad: (data: PremiumRequestRecord[], error?: string) => void;
}

export const FileUpload = ({ onDataLoad }: Props) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCsvData = (csvText: string): PremiumRequestRecord[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file must contain at least a header and one data row');
    }

    const header = lines[0].split(',').map(h => h.trim());
    const expectedHeaders = ['Timestamp', 'User', 'Model', 'Requests Used', 'Exceeds Monthly Quota', 'Total Monthly Quota'];
    
    // Validate headers
    if (!expectedHeaders.every(expected => header.includes(expected))) {
      throw new Error(`CSV must contain these columns: ${expectedHeaders.join(', ')}`);
    }

    const data: PremiumRequestRecord[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(cell => cell.trim());
      if (row.length !== header.length) {
        continue; // Skip malformed rows
      }

      try {
        const record: PremiumRequestRecord = {
          timestamp: row[header.indexOf('Timestamp')],
          user: row[header.indexOf('User')],
          model: row[header.indexOf('Model')],
          requestsUsed: parseFloat(row[header.indexOf('Requests Used')]),
          exceedsMonthlyQuota: row[header.indexOf('Exceeds Monthly Quota')].toLowerCase() === 'true',
          totalMonthlyQuota: row[header.indexOf('Total Monthly Quota')],
        };
        data.push(record);
      } catch (error) {
        console.warn(`Skipping malformed row ${i + 1}:`, row);
      }
    }

    if (data.length === 0) {
      throw new Error('No valid data rows found in CSV file');
    }

    return data;
  };

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      onDataLoad([], 'Please select a CSV file');
      return;
    }

    setIsProcessing(true);
    setFileName(file.name);

    try {
      const text = await file.text();
      const data = parseCsvData(text);
      onDataLoad(data);
    } catch (error) {
      onDataLoad([], error instanceof Error ? error.message : 'Failed to parse CSV file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload Premium Requests CSV
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? 'border-primary bg-primary/10' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            ref={fileInputRef}
            className="hidden"
          />
          
          <div className="flex flex-col items-center gap-4">
            <Upload className="h-12 w-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium">
                {isProcessing ? 'Processing...' : 'Drop your CSV file here'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                or click to browse files
              </p>
            </div>
            
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={isProcessing}
              variant="outline"
            >
              Choose File
            </Button>
            
            <Button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/sample-premium-data.csv';
                link.download = 'sample-premium-data.csv';
                link.click();
              }}
              variant="outline"
              size="sm"
            >
              Download Sample CSV
            </Button>
            
            {fileName && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {fileName}
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">Expected CSV Format:</p>
              <p className="text-blue-700 mt-1">
                Timestamp, User, Model, Requests Used, Exceeds Monthly Quota, Total Monthly Quota
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};