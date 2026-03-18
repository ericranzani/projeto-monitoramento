program Project1;

uses
  Vcl.Forms,
  monitoramento in 'C:\Users\eric_\OneDrive\Documentos\Embarcadero\Studio\Projects\monitoramento.pas' {Form1};

{$R *.res}

begin
  Application.Initialize;
  Application.MainFormOnTaskbar := True;
  Application.CreateForm(TForm1, Form1);
  Application.Run;
end.
