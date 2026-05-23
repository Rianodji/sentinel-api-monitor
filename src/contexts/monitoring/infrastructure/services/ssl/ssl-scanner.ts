import * as tls from 'tls';

export interface SslInfo {
  validTo: Date;
  daysRemaining: number;
  issuer: string;
}

export class SslScanner {
  static async getSslInfo(hostname: string): Promise<SslInfo> {
    return new Promise((resolve, reject) => {
      const socket = tls.connect(443, hostname, { servername: hostname }, () => {
        const cert = socket.getPeerCertificate();
        socket.end();

        if (!cert || Object.keys(cert).length === 0) {
          reject(new Error('No certificate found'));
          return;
        }

        const validTo = new Date(cert.valid_to);
        const daysRemaining = Math.ceil(
          (validTo.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        );

        const issuer = Array.isArray(cert.issuer.CN) 
          ? cert.issuer.CN.join(', ') 
          : cert.issuer.CN || 'Unknown';

        resolve({
          validTo,
          daysRemaining,
          issuer,
        });
      });

      socket.on('error', (err) => reject(err));
      socket.setTimeout(5000, () => {
        socket.destroy();
        reject(new Error('SSL scan timeout'));
      });
    });
  }
}
