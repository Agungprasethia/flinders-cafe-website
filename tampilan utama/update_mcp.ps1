$dir = "C:\Users\Personal\.gemini\config"
if (-not (Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir | Out-Null
}

$file = "$dir\mcp.json"
if (Test-Path $file) {
    $content = Get-Content $file -Raw
    if ([string]::IsNullOrWhiteSpace($content)) {
        $data = @{ mcpServers = @{} }
    }
    else {
        $data = ConvertFrom-Json $content
    }
}
else {
    $data = @{ mcpServers = @{} }
}

# If it's a PSCustomObject
if ($data -is [System.Management.Automation.PSCustomObject]) {
    if (-not $data.mcpServers) {
        $data | Add-Member -MemberType NoteProperty -Name "mcpServers" -Value @{}
    }
    
    $figmaConfig = @{
        command = "npx"
        args    = @("-y", "@modelcontextprotocol/server-figma")
        env     = @{
            FIGMA_ACCESS_TOKEN = "figd_kygc35w3l1liuWgwIthI3CIMcEgZsAAiOaukjG_e"
        }
    }

    $data.mcpServers | Add-Member -MemberType NoteProperty -Name "figma" -Value $figmaConfig -Force
    $data | ConvertTo-Json -Depth 10 | Set-Content $file -Encoding UTF8
    Write-Host "Konfigurasi MCP Figma berhasil ditambahkan ke $file."
}
else {
    Write-Host "Format mcp.json tidak dikenali. Silakan cek secara manual."
}
