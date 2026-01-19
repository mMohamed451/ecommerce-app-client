'use client';

import { useState } from 'react';
import { productApi } from '@/lib/api/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { toast } from 'sonner';

export function BulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [skipErrors, setSkipErrors] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    totalProcessed: number;
    successCount: number;
    errorCount: number;
    errors: string[];
  } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setUploadResult(null);
      } else {
        toast.error('Please select a CSV file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    try {
      setIsUploading(true);
      const result = await productApi.importProducts(file, skipErrors);
      setUploadResult(result);
      
      if (result.errorCount === 0) {
        toast.success(`Successfully imported ${result.successCount} products`);
      } else {
        toast.warning(
          `Imported ${result.successCount} products with ${result.errorCount} errors`
        );
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload products');
    } finally {
      setIsUploading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await productApi.exportProducts();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Products exported successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to export products');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Product Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">How to use bulk upload:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Download the CSV template below</li>
                  <li>Fill in your product information following the template format</li>
                  <li>Upload the completed CSV file</li>
                  <li>Review any errors and fix them if needed</li>
                </ol>
              </div>
            </div>
          </div>
          <div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Download CSV Template
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              The template includes all required fields and example data
            </p>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600 mb-1">
                {file ? file.name : 'Click to upload CSV file'}
              </span>
              <span className="text-xs text-gray-500">CSV files only</span>
            </label>
          </div>

          {file && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    setUploadResult(null);
                  }}
                >
                  Remove
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={skipErrors}
                  onChange={(e) => setSkipErrors(e.target.checked)}
                  label="Skip errors and continue importing"
                />
                <p className="text-xs text-gray-500 flex-1">
                  When enabled, rows with errors will be skipped and the import will continue with valid rows
                </p>
              </div>
              <Button onClick={handleUpload} isLoading={isUploading} className="w-full">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Products'}
              </Button>
            </div>
          )}

          {uploadResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {uploadResult.errorCount === 0 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                )}
                <h4 className="font-semibold">Upload Results</h4>
              </div>
              <div className="space-y-1 text-sm">
                <p>Total Processed: {uploadResult.totalProcessed}</p>
                <p className="text-green-600">
                  Successfully Imported: {uploadResult.successCount}
                </p>
                {uploadResult.errorCount > 0 && (
                  <>
                    <p className="text-red-600">Errors: {uploadResult.errorCount}</p>
                    {uploadResult.errors.length > 0 && (
                      <div className="mt-2 max-h-40 overflow-y-auto">
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          {uploadResult.errors.slice(0, 10).map((error, index) => (
                            <li key={index} className="text-red-600">
                              {error}
                            </li>
                          ))}
                          {uploadResult.errors.length > 10 && (
                            <li className="text-gray-500">
                              ... and {uploadResult.errors.length - 10} more errors
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
