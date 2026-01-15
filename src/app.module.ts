import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { NotificacaoService } from './app.service'; // Certifique-se que o nome do arquivo aqui está correto

@Module({
  imports: [],
  controllers: [AppController],
  providers: [NotificacaoService], // Aqui você deve usar o novo nome
})
export class AppModule {}
