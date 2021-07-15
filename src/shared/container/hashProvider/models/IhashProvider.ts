interface IHashProvider {
  generateHash(passwd: string): Promise<string>;
}

export default IHashProvider;
