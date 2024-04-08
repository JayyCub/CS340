export abstract class ImagesDAO {
  abstract putImage(fileName: string, imageStringBase64Encoded: string): Promise<string>;
}