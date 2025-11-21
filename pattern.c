/*#include<stdio.h>
int main(){
    int i,j,n;
    printf("Enter pattern length:");
    scanf("%d",&n);
    for(i=0;i<j;i++){
        for(j=0;j<n;j++){
            printf("*");
        }
        printf("\n");
    }
}*/
#include<stdio.h>
int main(){
    int i,j,n;
    printf("Enter pattern length:");
    scanf("%d",&n);
    for(i=1;i<=n;i++){
        for(j=10;j>=1;j--){
            printf("+");
        }
        printf("\n");
    }
}
