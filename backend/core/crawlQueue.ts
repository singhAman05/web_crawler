export class crawlQueue{
    private queue: string[] = [];
    private visited: Set<string> = new Set<string>();

    constructor(seedUrl:string){
        this.enqueue(seedUrl)
    }

    enqueue(url : string): boolean {
        if(this.hasVisited(url)){
            return false;
        }
        this.queue.push(url);
        this.visited.add(url);
        return true;
    }

    dequeue(): string | undefined {
        return this.queue.shift();
    }

    isEmpty() : boolean{
        return this.queue.length===0
    }

    size() : number{
        return this.queue.length;
    }

    hasVisited(url : string) : boolean{
        return this.visited.has(url);
    }

    visitedCount() : number{
        return this.visited.size;
    }
}