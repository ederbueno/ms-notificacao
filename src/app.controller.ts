import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificacaoService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly notificacaoService: NotificacaoService) {}

  @EventPattern('venda_confirmada')
  handleNotificacao(@Payload() data: any) {
    const payload = data.value || data;
    console.log('----------------------------------------------------');
    console.log('📧 ENVIANDO NOTIFICAÇÃO AO CLIENTE');
    console.log(`Para: ${payload.clienteId}@email.com`);
    console.log(`Mensagem: Olá ${payload.clienteId}, seu pedido ${payload.vendaId} foi confirmado!`);
    console.log('----------------------------------------------------');
  }

  @EventPattern('venda_realizada')
  async handleVendaConcluida(@Payload() data: any) {
    const payload = data.value || data;

    setTimeout(async () => {
      await this.notificacaoService.enviarEmailNotaFiscal(payload);
    }, 3000);
  }

  @EventPattern('venda_cancelada')
  handleVendaCancelada(@Payload() data: any) {
    const payload = data.value || data;
    console.log('----------------------------------------------------');
    console.log('❌ NOTIFICAÇÃO: VENDA CANCELADA');
    console.log(`Pedido: ${payload.vendaId}`);
    console.log(`Motivo: ${payload.motivo}`);
    console.log('----------------------------------------------------');
  }
}