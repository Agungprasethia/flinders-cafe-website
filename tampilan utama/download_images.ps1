$images = @{
    "hero-bg.jpg" = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ff65b807-4d37-41e2-91c7-b9610029dd6c"
    "logo.png" = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/ba667bd4-3a7c-4983-9857-cb03e5706b71"
    "about-bg.jpg" = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/bbd6ba82-fd33-4edb-a6bf-7528e8932739"
    "gallery-bg.jpg" = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/bc5d8d4d-785f-4f8b-bfd9-959ce6084c88"
    "menu-food.png" = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/5520e1e7-7397-46b1-96bc-18308f762d92"
    "menu-food-gray.png" = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/4dfc891c-3ed3-482a-974d-fe788a1fac32"
    "promo-bg.jpg" = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/0c3f5d5e-14a6-4c1e-be3c-7773f5f367d9"
    "promo1.jpg" = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/474c39b2-27ef-4c7d-90bd-20b50bc5595d"
    "promo2.jpg" = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/c5dbd0d7-bf88-4a02-9e9a-db31ad678553"
    "gallery-item.jpg" = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/bdf8cb96-80ed-4664-b1fb-85cbba9d84e0"
    "reservasi-logo.png" = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/29b9e9b1-9196-40d0-a342-164f591b29c6"
    "reservasi-bg.jpg" = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/6c6e0afb-3dcd-4f33-978a-c1719ff91626"
    "reservasi-step2.png" = "https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/fa3564c8-6721-4300-87fc-9247f5ebbee1"
}

New-Item -ItemType Directory -Force -Path "src\assets\images" | Out-Null

foreach ($name in $images.Keys) {
    $url = $images[$name]
    $dest = "src\assets\images\$name"
    Write-Output "Downloading $name..."
    Invoke-WebRequest -Uri $url -OutFile $dest
}
Write-Output "Done downloading 10 images."
