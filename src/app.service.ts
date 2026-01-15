import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as path from 'path';

@Injectable()
export class NotificacaoService {
  private readonly logger = new Logger(NotificacaoService.name);
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "75f671268f8b80",
        pass: "64e73b9bd150a9"
      }
    });
  }

  async enviarEmailNotaFiscal(venda: any) {
    const vendaId = venda.vendaId;
    const destinatario = venda.clienteEmail || "bueno.ederson@gmail.com";
    const nomeCliente = venda.clienteNome || "Cliente Especial";

    this.logger.log(`📧 Preparando e-mail para: ${destinatario} (Venda: ${vendaId})`);

    const pdfPath = path.join('/app/notas', `NF-Venda-${vendaId}.pdf`);

    const mailOptions = {
      from: '"ERP Edma Solutions" <noreply@edmasolutions.com>',
      to: destinatario, // Agora usa a variável dinâmica
      subject: `Sua Nota Fiscal - Pedido #${vendaId}`,
      // Mudamos para HTML para ficar mais profissional
      html: `
        <div style="font-family: sans-serif; line-height: 1.5;">
          <h2>Olá, ${nomeCliente}!</h2>
          <p>Obrigado por comprar na <b>Edma Solutions</b>.</p>
          <p>Sua nota fiscal referente ao pedido <strong>#${vendaId}</strong> já foi gerada e está anexada a este e-mail.</p>
          <br>
          <p>Atenciosamente,<br>Equipe Financeira</p>
        </div>
      `,
      attachments: [
        {
          filename: `NotaFiscal-${vendaId}.pdf`,
          path: pdfPath
        }
      ]
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ E-mail enviado com sucesso para ${destinatario}`);
    } catch (error) {
      this.logger.error(`❌ Falha ao enviar e-mail para ${destinatario}: ${error.message}`);
    }
  }
}