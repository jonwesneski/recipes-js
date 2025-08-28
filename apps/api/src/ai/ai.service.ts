import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private readonly ai: GoogleGenAI;
  constructor(private readonly configService: ConfigService) {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  // static async createInstance() {
  //   const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  //   return new AiService(ai);
  // }

  async nutritionalFacts(body: any): Promise<any> {
    return this.ai;
  }
}
