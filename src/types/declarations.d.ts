declare module "read-data";

declare namespace NodeJS {
  interface Global {
    BEGIN_SEQ: string;
    END_SEQ: string;
  }
}
