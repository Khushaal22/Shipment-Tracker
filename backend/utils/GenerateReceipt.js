const PDFDocument = require('pdfkit');

const GenerateReceipt = (shipment) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];

        doc.on('data', (chunck) => buffers.push(chunck));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        doc
            .fillColor('#3b82f6')
            .fontSize(24)
            .font('Helvetica-Bold')
            .text('SHIPMENT TRACKER', { align: 'center' });

        doc
            .fillColor('#6b7280')
            .fontSize(10)
            .font('Helvetica')
            .text('Official Shipment Receipt', { align: 'center' });

        doc.moveDown(0.5);

        doc
            .moveTo(50, doc.y)
            .lineTo(545, doc.y)
            .strokeColor('#e5e7eb')
            .lineWidth(1)
            .stroke();

        doc.moveDown(1);

        doc
            .fillColor('#111827')
            .fontSize(13)
            .font('Helvetica-Bold')
            .text('Tracking Number:', { continued: true })
            .font('Helvetica')
            .fillColor('#3b82f6')
            .text(` ${shipment.trackingNumber}`);

        doc.moveDown(0.4);

        doc
            .fillColor('#6b7280')
            .fontSize(10)
            .font('Helvetica')
            .text(`Created: ${new Date(shipment.createdAt).toDateString()}`)
            .text(`Estimated Delivery: ${new Date(shipment.estimatedDelivery).toDateString()}`);

        doc.moveDown(1);

        doc
            .fillColor('#111827')
            .fontSize(11)
            .font('Helvetica-Bold')
            .text('Current Status:', { continued: true })
            .font('Helvetica')
            .fillColor('#6b7280')
            .text(` ${shipment.currentStatus.replace(/_/g, ' ').toUpperCase()}`);

        doc.moveDown(1);

        doc
            .moveTo(50, doc.y)
            .lineTo(545, doc.y)
            .strokeColor('#e5e7eb')
            .lineWidth(1)
            .stroke();

        doc.moveDown(1);

        doc
            .fillColor('#3b82f6')
            .fontSize(12)
            .font('Helvetica-Bold')
            .text('RECEIVER INFORMATION');

        doc.moveDown(0.5);

        const receiverFields = [
            { label: 'Name', value: shipment.receiverName },
            { label: 'Phone', value: shipment.receiverPhone },
            { label: 'Email', value: shipment.receiverEmail || 'N/A' },
            { label: 'Delivery Address', value: shipment.deliveryAddress },
            { label: 'Destination City', value: shipment.destinationCity },
        ];

        receiverFields.forEach(({ label, value }) => {
            doc
                .fillColor('#374151')
                .fontSize(10)
                .font('Helvetica-Bold')
                .text(`${label}: `, { continued: true })
                .font('Helvetica')
                .fillColor('#6b7280')
                .text(value);
        });

        doc.moveDown(1);

        doc
            .moveTo(50, doc.y)
            .lineTo(545, doc.y)
            .strokeColor('#e5e7eb')
            .lineWidth(1)
            .stroke();

        doc.moveDown(1);

        doc
            .fillColor('#3b82f6')
            .fontSize(12)
            .font('Helvetica-Bold')
            .text('PICKUP INFORMATION');

        doc.moveDown(0.5);

        const pickupFields = [
            { label: 'Pickup Address', value: shipment.pickupAddress },
            { label: 'Source City', value: shipment.sourceCity },
        ];

        pickupFields.forEach(({ label, value }) => {
            doc
                .fillColor('#374151')
                .fontSize(10)
                .font('Helvetica-Bold')
                .text(`${label}: `, { continued: true })
                .font('Helvetica')
                .fillColor('#6b7280')
                .text(value);
        });

        doc.moveDown(1);

        // Divider
        doc
            .moveTo(50, doc.y)
            .lineTo(545, doc.y)
            .strokeColor('#e5e7eb')
            .lineWidth(1)
            .stroke();

        doc.moveDown(1);
        doc
            .fillColor('#3b82f6')
            .fontSize(12)
            .font('Helvetica-Bold')
            .text('PARCEL INFORMATION');

        doc.moveDown(0.5);

        const parcelFields = [
            { label: 'Type', value: shipment.parcelType.charAt(0).toUpperCase() + shipment.parcelType.slice(1) },
            { label: 'Weight', value: `${shipment.parcelWeight} kg` },
        ];

        parcelFields.forEach(({ label, value }) => {
            doc
                .fillColor('#374151')
                .fontSize(10)
                .font('Helvetica-Bold')
                .text(`${label}: `, { continued: true })
                .font('Helvetica')
                .fillColor('#6b7280')
                .text(value);
        });

        doc.moveDown(2);

        doc
            .moveTo(50, doc.y)
            .lineTo(545, doc.y)
            .strokeColor('#e5e7eb')
            .lineWidth(1)
            .stroke();

        doc.moveDown(0.5);

        doc
            .fillColor('#9ca3af')
            .fontSize(9)
            .font('Helvetica')
            .text('This is an automatically generated receipt from Shipment Tracker.', { align: 'center' })
            .text('Please keep this document for your records.', { align: 'center' });

        doc.end();
    });
};

module.exports = GenerateReceipt;