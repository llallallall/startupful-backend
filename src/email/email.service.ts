import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';
import { ConfigType } from '@nestjs/config';

import { Inject, Injectable } from '@nestjs/common';
import emailConfig from 'src/config/emailConfig';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(
    @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
  }
  // 앱비밀번호 frddltceecbyqafa
  // 기존 비밀번호 ds12345678!!
  async sendMemberJoinVerification(
    emailAddress: string,
    signupVerifyToken: string,
  ) {
    const baseUrl = this.config.baseUrl;

    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;

    const mailOption: EmailOptions = {
      to: emailAddress,
      subject: '가입 인증 메일',
      html: `<div style="text-align:center">가입확인 버튼을 누르시면 가입인증이 완료됩니다.<br/>${url}<br/><form action="${url}" method="POST"><button>가입확인</button></form></div>`,
    };

    return await this.transporter.sendMail(mailOption);
  }
}
