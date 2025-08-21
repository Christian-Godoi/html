import java.util.Scanner;

public class lista05 {

	public static void main(String[] args) {
	

		
		Scanner scanner = new Scanner(System.in);
		
	
//1

double idade;
System.out.println("Qual a sua idade?");
idade = scanner.nextDouble();
if(idade <= 12) {
	System.out.println("Você é uma criança");
} else if (idade <= 17) {
	System.out.println("Você é um adolescente");
}else if (idade <= 59) {
	System.out.println("Você é  um adulto");
} else 
	System.out.println("Você é um idoso");


//2

double temp;
System.out.println("Qual a temperatura em graus? ");
temp = scanner.nextDouble();
if(idade <= 10) {
	System.out.println("A temperatura está  muito fria");
} else if (temp <= 20) {
	System.out.println("A temperatura está fria");
}else if (temp <= 30) {
	System.out.println("A temperatura está agradável");
} else 
	System.out.println("A temperatura está muito quente");


//3

double nota;
System.out.println("Escreva uma nota para que eu possa correspondê-la a uma letra ");
nota = scanner.nextDouble();
if(nota >= 90) {
	System.out.println("letra A");
} else if (nota >= 80) {
	System.out.println("letra B");
}else if (nota >= 70) {
	System.out.println("letra C");
} else if (nota >= 60 ) {
	System.out.println("letra D");
} else {
	System.out.println("letra D");
}
	

//4


System.out.println("Digite sua senha");
String admim2 = scanner.next();
System.out.println("\n");
if(admim2.equals("admin")) { 
	System.out.println("Acesso Permitido!");
} else {
	System.out.println("Acesso Negado!");
}

//5

System.out.println("Escreva dois nomes: ");
String nome1 = scanner.next();
System.out.println("Escreva outro nome");
String nome2 = scanner.next();
if(nome1.equals(nome2)) {
	System.out.println("Os nomes são iguais");
} else {
	System.out.println("Os nomes são diferentes");
}

//6

System.out.println("Qual a sua cor favorita? ");
String cor = scanner.next();
if(cor.equalsIgnoreCase("azul")) {
	System.out.println("Boa escolha!");
} else if (cor.equalsIgnoreCase("Vermelho")) {
	System.out.println("Cor vibrante!");
} else if (cor.equalsIgnoreCase("Verde")) {
	System.out.println("Cor da natureza!");
} else {
	System.out.println("Cor não cadastrada.");
}

//7

String letra;
System.out.println("Digite uma letra");
letra = scanner.next();
if(letra == "a") {
	System.out.println("É uma vogal");
} if(letra == "e") {
	System.out.println("É uma vogal");
} if(letra == "i") {
	System.out.println("É uma vogal");
} if(letra == "o") {
	System.out.println("É uma vogal");
} if(letra == "u") {
	System.out.println("É uma vogal");
} else {
	System.out.println("Não é vogal");
}
	







	}


		
		
	}


