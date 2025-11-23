'use client'

import { useRef, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Download } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Định nghĩa interface cho props của component
interface DownloadPDFButtonProps {
  postBody: any[];
  postTitle: string;
}

const preloadImages = async (postBody: any[]) => {
  const imageUrls: string[] = [];

  // Tìm tất cả các hình ảnh trong postBody
  postBody.forEach(block => {
    if (block._type === 'image' && block.asset?.url) {
      imageUrls.push(block.asset.url);
    }
  });

  // Tải trước hình ảnh
  const imagePromises = imageUrls.map(url => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.crossOrigin = 'Anonymous'; // Yêu cầu CORS
      img.onload = resolve;
      img.onerror = reject;
    });
  });

  await Promise.all(imagePromises);
};

export function DownloadPDFButton({ postBody, postTitle }: DownloadPDFButtonProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Tải trước hình ảnh khi component được mount
  useEffect(() => {
    preloadImages(postBody).catch(err => {
      console.error('Failed to preload images:', err);
    });
  }, [postBody]);

  // Hàm xử lý khi người dùng nhấp vào button "Download PDF"
  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    try {
      // Tạo canvas từ nội dung HTML
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Định nghĩa margin trên và dưới
      const topMargin = 20; // Khoảng cách từ đỉnh trang đến nội dung
      const bottomMargin = 20; // Khoảng cách từ nội dung đến đáy trang

      // Thêm header với styling
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Vietnamese Learning Blog', 105, 10, { align: 'center' });

      // Thêm ngày tải xuống
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Downloaded on ${new Date().toLocaleDateString()}`, 105, 15, {
        align: 'center',
      });

      // Thêm tiêu đề bài viết
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.setTextColor(0, 0, 0);
      pdf.text(postTitle, 105, 25, { align: 'center', maxWidth: 180 });

      // Tính toán kích thước hình ảnh trong PDF
      const imgWidth = 190; // Chiều rộng PDF (A4: 210mm - margin 10mm mỗi bên)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = 297 - topMargin - bottomMargin; // Chiều cao khả dụng của trang (trừ margin trên/dưới)
      let heightLeft = imgHeight;
      let position = 35; // Vị trí bắt đầu sau tiêu đề (bao gồm top margin)

      // Thêm hình ảnh canvas vào PDF
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);

      // Xử lý phân trang
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + topMargin + 30; // Đảm bảo top margin trên trang mới
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Thêm footer với styling
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Powered by Vietnamese Learning App', 105, 287, {
        align: 'center',
      });

      // Tải file PDF với tên mới
      pdf.save(`${postTitle} - VietnameseNext.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <>
      {/* Button để tải PDF */}
      <Button
        className="w-full"
        variant="default"
        onClick={handleDownloadPDF}
      >
        <Download className="mr-2 h-4 w-4" />
        Download PDF
      </Button>

      {/* Nội dung ẩn để render vào PDF */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div
          ref={contentRef}
          style={{
            width: '800px',
            padding: '20px',
            backgroundColor: 'white',
            color: 'black',
          }}
        >
          <PortableText
            value={postBody}
            components={{
              block: {
                h2: ({ children }) => (
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '20px 0 10px', color: '#1a1a1a' }}>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '15px 0 8px', color: '#2a2a2a' }}>
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0 6px', color: '#3a3a3a' }}>
                    {children}
                  </h4>
                ),
                h5: ({ children }) => (
                  <h5 style={{ fontSize: '16px', fontWeight: 'bold', margin: '8px 0 4px', color: '#4a4a4a' }}>
                    {children}
                  </h5>
                ),
                normal: ({ children }) => (
                  <p style={{ fontSize: '14px', margin: '10px 0', lineHeight: '1.6', color: '#333333' }}>
                    {children}
                  </p>
                ),
              },
              types: {
                image: ({ value }) => {
                  const imageUrl = value.asset?.url;
                  if (!imageUrl) return null;

                  return (
                    <div style={{ margin: '20px 0' }}>
                      <img
                        src={imageUrl}
                        alt={value.alt || 'Blog content image'}
                        style={{
                          maxWidth: '100%',
                          height: 'auto',
                          display: 'block',
                          margin: '0 auto',
                        }}
                        crossOrigin="anonymous"
                      />
                      {value.caption && (
                        <p
                          style={{
                            textAlign: 'center',
                            fontSize: '12px',
                            color: '#666666',
                            marginTop: '8px',
                          }}
                        >
                          {value.caption}
                        </p>
                      )}
                    </div>
                  );
                },
              },
            }}
          />
        </div>
      </div>
    </>
  );
}