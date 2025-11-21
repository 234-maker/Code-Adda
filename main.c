#include<stdio.h>
int main(){
    int n, digit1=0,digit2=0,digit3=0,sum=0;
    printf("Enter the number:");
    scanf("%d\n",&n);
    digit1=n%10;
    digit2=(n/10)%10;
    digit3=(n/100)%10;
    printf("Digit:%d\n %d\n %d\n",digit1,digit2,digit3);
    sum = (digit1)*(digit1)+(digit2)*(digit2)+(digit3)*(digit3);
    printf("Sum: %d\n",sum);
    if(sum==1){
        printf("Happy Number\n");
    }else
    {
        printf("Not Happy\n");
    }
}